using FrontEnd.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
_ = builder.Services.AddDistributedMemoryCache();
_ = builder.Services.AddResponseCaching();
//httpclient
_ = builder.Services.AddHttpContextAccessor().AddHttpClient("BaseClient", httpClient =>
{
    httpClient.DefaultRequestVersion = new Version(3, 0);
});
_ = builder.Services.AddSingleton<IUserManage, UserManage>();
_ = builder.Services.AddSingleton<IJsonOptions, JsonOpts>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
