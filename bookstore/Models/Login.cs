using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace bookstore.Models
{
    public class Login
    {
        public int Id { get; set; }
        public string Username { get; set; }

        [Required]
        [Display(Name ="ددددددرمز ورود")]
        [MinLength(12)]
        [MaxLength(18)]
        public string Password { get; set; }
        [Required]
        [Display(Name = "ایمیل")]
        [MinLength(12)]
        [MaxLength(18)]
        public string Email { get; set; }
        public bool IsAdmin { get; set; }

        
        
    }
}
