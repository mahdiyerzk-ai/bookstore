using System.ComponentModel.DataAnnotations;

namespace bookstore.Models.ViewModels
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage ="وارد کردن نام الزامی است")]
        [Display(Name ="نام")]
       
        public string Name { get; set; }

        [Required(ErrorMessage ="وارد کردن نام خاتوادگی الزامی است")]
        [Display(Name ="نام خانوادگی")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "وارد کردن ایمیل الزامی است")]
        [Display(Name ="ایمیل")]
        public string Email { get; set; }

        [Required(ErrorMessage = "وارد کردن رمز الزامی است")]
        [Display(Name ="رمز")]
        public string Password { get; set; }

        [Required(ErrorMessage = "تکرار رمز الزامی است")
        [Display(Name ="تکرار رمز")]
        [Compare("Password")]
        public string RePassword { get; set; }

        public bool Terms { get; set; }
    }
}
