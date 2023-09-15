using BackEnd.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data;

public class DataContext : IdentityDbContext<AppUser, AppRole, int>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<AppRole> AppRoles => Set<AppRole>();
    public DbSet<AppUserDetail> AppUserDetails => Set<AppUserDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        _ = modelBuilder.Entity<AppUser>(a =>
        {
            _ = a.HasOne(x => x.Parent)
                .WithMany(x => x.Children)
                .HasForeignKey(x => x.ParentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.ClientSetNull);

            _ = a.HasOne(x => x.AppUserDetail)
                .WithOne(x => x.AppUser)
                .HasForeignKey<AppUserDetail>(x => x.AppUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });
        base.OnModelCreating(modelBuilder);
    }

}