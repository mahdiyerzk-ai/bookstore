using System.ComponentModel.DataAnnotations;

namespace bookstore.Models
{
    public class User
    {
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; }

    [Required]
    [StringLength(255)]
    public string Password { get; set; }

    [StringLength(20)]
    public string ConfirmPassword { get; set; }

    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? LastLoginDate { get; set; }
    public bool IsActive { get; set; } = false;
    public bool IsAdmin { get; set; } = false;
    //public string Role { get; set; } = "User";
}
}