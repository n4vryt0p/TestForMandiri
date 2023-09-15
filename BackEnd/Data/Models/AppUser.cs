using Microsoft.AspNetCore.Identity;

namespace BackEnd.Data.Models;

public class AppUser : IdentityUser<int>
{
    public int? AppUserDetailId { get; set; }
    public AppUserDetail? AppUserDetail { get; set; }
    public int? ParentId { get; set; }
    public AppUser? Parent { get; set; }
    public ICollection<AppUser>? Children { get; set; }
}