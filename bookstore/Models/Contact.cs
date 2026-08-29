using System.ComponentModel.DataAnnotations;

namespace bookstore.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(200)]
        public string Subject { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.Now;
        public bool IsRead { get; set; } = false;
        public string? Response { get; set; }
    }
}
