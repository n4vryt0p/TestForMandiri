using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Data.Models;

public class AppUserDetail
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string? NamaLengkap { get; set; }
    public string? Alamat { get; set; }
    public long NoKtp { get; set; }

    public int AppUserId { get; set; }
    public AppUser? AppUser { get; set; }
}