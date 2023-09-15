using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Text;
using BackEnd.Data;
using BackEnd.Data.Models;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContextPool<DataContext>((sp, options) =>
    {
        _ = options.UseSqlServer(connectionString, b =>
        {
            _ = b.CommandTimeout(3600);
            _ = b.EnableRetryOnFailure(2);
        });
    })
    .AddIdentity<AppUser, AppRole>(options =>
    {
        // Password settings
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 4;
        options.Password.RequiredUniqueChars = 0;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Lockout.MaxFailedAccessAttempts = 3;
        // Lockout settings
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromDays(1);
        // User settings
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

#region User
app.MapGet("/userlist", async (DataContext db) => await db.AppUsers.AsNoTracking().Select(u => new UserList(
        u.UserName, u.Email, u.AppUserDetail!.Alamat, u.AppUserDetail.NoKtp, u.AppUserDetail.NamaLengkap)).ToListAsync())
    .WithTags("Users")
    .WithName("UserList")
    .WithOpenApi();

//Add User
_ = app.MapPost("/user/add", async (UserDto userdto, UserManager<AppUser> userManager, DataContext db) =>
{
    var user = new AppUser
    {
        UserName = userdto.UserName,
        Email = userdto.Email,
        Children = new List<AppUser>(),
        AppUserDetail = new AppUserDetail()
    };

    if (string.IsNullOrEmpty(userdto.NamaLengkap) && string.IsNullOrEmpty(userdto.Alamat) && userdto.NoKtp > 0)
    {
        user.AppUserDetail = new AppUserDetail
        {
            Alamat = userdto.Alamat,
            NamaLengkap = userdto.NamaLengkap,
            NoKtp = userdto.NoKtp ?? 0,
        };
    }

    if (userdto.Users != null)
        user.Children = await db.AppUsers.Where(ee => userdto.UserIds.Contains(ee.Id)).ToListAsync();

    if (userdto.Pass != null)
    {
        var result = await userManager.CreateAsync(user, userdto.Pass);
        if (result.Succeeded)
        {

            var emailConfirm = await userManager.GenerateEmailConfirmationTokenAsync(user);
            if (!string.IsNullOrEmpty(emailConfirm))
                await userManager.ConfirmEmailAsync(user, emailConfirm);

            if (userdto.Roles != null)
            {
                var result2 = await userManager.AddToRolesAsync(user, userdto.Roles);
                if (!result2.Succeeded)
                    Results.BadRequest();
            }
        }

        return result.Succeeded ? Results.Ok() : Results.BadRequest();
    }

    return Results.NotFound();
})
    .WithTags("Users")
    .WithName("AddUser")
    .WithOpenApi();

//Edit User
_ = app.MapPut("/user/edit/{userId}", async (int userId, UserDto userdto, UserManager<AppUser> userManager, DataContext db) =>
{
    var userX = await db.AppUsers.Include(t => t.AppUserDetail).AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId).ConfigureAwait(false);
    if (userX == null)
        return Results.NotFound("No such user");

    if (!string.IsNullOrEmpty(userdto.UserName)) userX.UserName = userdto.UserName;
    if (!string.IsNullOrEmpty(userdto.NamaLengkap)) userX.AppUserDetail!.NamaLengkap = userdto.NamaLengkap;
    if (!string.IsNullOrEmpty(userdto.Alamat)) userX.AppUserDetail!.Alamat = userdto.Alamat;
    if (userdto.NoKtp > 0) userX.AppUserDetail!.NoKtp = userdto.NoKtp ?? 0;
    if (!string.IsNullOrEmpty(userdto.Email)) userX.Email = userdto.Email;

    if (userdto.Users != null)
    {
        var userChildExist = await db.AppUsers.Where(ee => ee.ParentId == userId).ToListAsync();
        if (userChildExist.Count > 0)
        {
            foreach (var child in userChildExist)
                child.ParentId = null;

            db.AppUsers.UpdateRange(userChildExist);
        }

        var userChild = await db.AppUsers.Where(ee => userdto.UserIds.Contains(ee.Id)).ToListAsync();
        if (userChild.Count > 0)
        {
            foreach (var child in userChild)
                child.ParentId = userId;

            db.AppUsers.UpdateRange(userChild);
        }
    }

    StringBuilder msg = new();

    if (userdto.Roles != null)
    {
        var existRoles = await userManager.GetRolesAsync(userX);
        if (existRoles.Count > 0)
        {
            var result = await userManager.RemoveFromRolesAsync(userX, existRoles);
            if (!result.Succeeded)
                _ = msg.AppendLine("Eror when reset roles, please call helpdesk");

        }
        var result2 = await userManager.AddToRolesAsync(userX, userdto.Roles);
        if (!result2.Succeeded)
            _ = msg.AppendLine("Eror when adding roles, please call helpdesk.");
    }

    if (!string.IsNullOrEmpty(msg.ToString())) return Results.BadRequest(msg.ToString());

    _ = db.AppUsers.Update(userX);
    _ = await db.SaveChangesAsync();

    return Results.Ok();
})
        .WithTags("Users")
        .WithName("UpdateUser")
        .WithOpenApi();

//Delete User
_ = app.MapDelete("/user/delete/{userId}",
        async (int userId, UserManager<AppUser> userManager, DataContext db) =>
        {
            var userX = await userManager.FindByIdAsync(userId.ToString()).ConfigureAwait(false);
            if (userX == null)
                return Results.NotFound("No such user");

            _ = db.AppUsers.Remove(userX);
            _ = await db.SaveChangesAsync();

            return Results.Ok();
        })
    .WithTags("Users")
    .WithName("DeleteUser")
    .WithOpenApi();

//Get User Roles & User to assigned
_ = app.MapGet("/userandroles", async (DataContext db) =>
{
    return new GroupRoleDdl
    {
        Groups = await db.AppUsers.AsNoTracking()//.Where(tt => tt.Id != userId)
            .Select(x => new GroupDdl { Id = x.Id, Text = x.UserName })
            .ToListAsync(),
        Roles = await db.AppRoles.AsNoTracking()
            .Select(x => new GroupDdl
            {
                Id = x.Id,
                Text = x.Name
            }).ToListAsync()
    };
})
    .WithTags("Users")
    .WithName("GetUserAndRoles")
    .WithOpenApi();

#endregion

#region Role
//app.MapGet("/rolelist", async (DataContext db) => await db.AppRoles.AsNoTracking().ToListAsync())
//    .WithName("RoleList")
//    .WithOpenApi();

//Get all roles
_ = app.MapGet("/rolelist", async (DataContext db) =>
        await db.AppRoles.AsNoTracking()
            .Select(x => new GroupDto
            {
                RoleId = x.Id,
                RoleName = x.Name
            }).ToListAsync()
    )
    .WithTags("Roles")
    .WithName("GetRoleList")
    .WithOpenApi();

//Get all roles DDL
_ = app.MapGet("/rolelistddl", async (DataContext db) =>
        await db.AppRoles.AsNoTracking()
            .Select(x => new GroupDdl
            {
                Id = x.Id,
                Text = x.Name
            }).ToListAsync()
    )
    .WithTags("Roles")
    .WithName("GetRoleListDDL")
    .WithOpenApi();

//Add role
_ = app.MapPost("/role/add", async (RoleDto userdto, RoleManager<AppRole> roleManager) =>
{

    _ = await roleManager.CreateAsync(new AppRole
    {
        Name = userdto.RoleName
    });

    return Results.Ok();
})
    .WithTags("Roles")
    .WithName("AddRole")
    .WithOpenApi();

//Edit role
_ = app.MapPut("/role/edit/{roleId}", async (int roleId, RoleDto userdto, RoleManager<AppRole> roleManager) =>
{
    var existRole = await roleManager.FindByIdAsync(roleId.ToString());
    if (existRole == null)
        return Results.BadRequest("No such role");

    existRole.Name = userdto.RoleName;

    _ = await roleManager.UpdateAsync(existRole);

    return Results.Ok();
})
    .WithTags("Roles")
    .WithName("UpdateRole")
    .WithOpenApi();

//Delete role
_ = app.MapDelete("/role/delete/{id}", async (int id, RoleManager<AppRole> roleManager) =>
{
    var user = await roleManager.FindByIdAsync(id.ToString());
    if (user == null)
        return Results.BadRequest("No such role");

    _ = await roleManager.DeleteAsync(user);
    return Results.Ok();
})
    .WithTags("Roles")
    .WithName("DeleteRole")
    .WithOpenApi();
#endregion

using var scope = app.Services.CreateScope();
var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
await dataContext.Database.EnsureCreatedAsync();

app.Run();

#region Records
internal record UserList(string? UserName, string? Email, string? Alamat, long? NoKtp, string? NamaLengkap);

internal record UserDto(int Id, string? UserName, string? Pass, string? NamaLengkap, string? Email, string? Alamat, long? NoKtp, IEnumerable<string>? Roles, IEnumerable<int>? Users)
{
    public int[] UserIds => Users?.ToArray() ?? Array.Empty<int>();
}
#endregion

#region ModelDto
public class GroupDdl
{
    [DisplayName("Group Id")]
    public int Id { get; set; }

    [MaxLength(255)]
    [DisplayName("Group Name")]
    public string? Text { get; set; }

    //[DisplayName("Zoom Id")]
    [MaxLength(255)]
    public string? Extend { get; set; }
}
public class GroupRoleDdl
{
    public IEnumerable<GroupDdl>? Groups { get; set; }
    public IEnumerable<GroupDdl>? Roles { get; set; }
    public IEnumerable<GroupDdl>? Package { get; set; }
}
public class GroupDto
{
    [DisplayName("Role Id")]
    public int RoleId { get; set; }

    [DisplayName("Group Id")]
    public int GroupId { get; set; }

    [MaxLength(20)]
    [DisplayName("Application Name")]
    public string? AppId { get; set; }

    [MaxLength(1000)]
    [DisplayName("Group Name")]
    public string? GroupName { get; set; }

    [MaxLength(255)]
    [DisplayName("Group")]
    public string? Group { get; set; }

    [MaxLength(50)]
    [DisplayName("Role Name")]
    public string? RoleName { get; set; }

    [DisplayName("Is Delete")]
    public bool IsDelete { get; set; }
}
public class RoleDto
{
    public int? RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public int GroupId { get; set; }
    public string? GroupName { get; set; }
}
#endregion