using System.ComponentModel.DataAnnotations;

namespace bookstore.Models.ViewModels
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage ="وارد کردن نام الزامی است")]
        [Display(Name ="نام")]
       
        public string Name { get; set; }

        [Required]
        [Display(Name ="نام خانوادگی")]
        public string LastName { get; set; }

        [Required]
        [Display(Name ="ایمیل")]
        public string Email { get; set; }

        [Required]
        [Display(Name ="رمز")]
        public string Password { get; set; }

        [Required]
        [Display(Name ="لکرار رمز")]
        [Compare("Password")]
        public string RePassword { get; set; }

        public bool Terms { get; set; }
    }
}
