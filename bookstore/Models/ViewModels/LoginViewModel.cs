using System.ComponentModel.DataAnnotations;

namespace bookstore.Models.ViewModels
{
    public class LoginViewModel
    {
        [Required]
        [Display(Name = "رمز ورود")]
        [MinLength(12)]
        public string Password { get; set; }

        [Required(ErrorMessage ="ایمیل زا وارد کنید")] // data annotaion
        [Display(Name = "ایمیل")]
        [MinLength(12)]
        [MaxLength(18)]
        public string Email { get; set; }

        [Display(Name = "مرا به هاطر بسپار")]
        public bool RememberMe { get; set; }
    }
}
