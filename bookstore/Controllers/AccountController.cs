using bookstore.Models;
using bookstore.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel login)
        {
            return PartialView("_Login");
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(RegisterViewModel reg)
        {
            return PartialView("_Register");
        }
    }
}
