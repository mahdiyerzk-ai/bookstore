using System.ComponentModel.DataAnnotations;

namespace bookstore.Models.DTOs
{
    public class LoginDto
    {
        [Required] // data annotaion
        [Display(Name = "رمز ورود")]
        [MinLength(12)]
        public string Password { get; set; }

        [Required]
        [Display(Name = "ایمیل")]
        [MinLength(12)]
        [MaxLength(18)]
        public string Email { get; set; }

        [Display(Name = "مرا به هاطر بسپار")]
        public bool RememberMe { get; set; }
    }
}
