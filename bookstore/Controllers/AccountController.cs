using bookstore.Models;
using bookstore.Models.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace bookstore.Controllers
{
    public class AccountController : Controller
    {
        // variable or property - data type: ApplicationDbContext - name: _context
        // example: private readonly string _family; 
        public readonly ApplicationDbContext _context;
        
        // constructor
        public AccountController(ApplicationDbContext c)
        {
            // initialize
            _context = c;
        }
        
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }


        //[HttpPost]
        //public IActionResult Login(LoginViewModel login)
        //{
        //    return PartialView("_Login");
        //}

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(User user)
        {
            user.CreatedAt = DateTime.Now;
            user.IsActive = false;
            user.Email = user.Email.Trim(); // '    m.samnejad92@gmail.com   ' trim method removes white spaces from beginning and end of string
            user.Password = user.Password.Trim(); // "Aa123456  "
            user.FirstName = user.FirstName.Trim();
            user.LastName = user.LastName.Trim();
            //user.RecoveryCode = 0;
            if (!ModelState.IsValid) return View("Index",user);

            Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$"); // Regular Expressions
            Match match = regex.Match(user.Email);
            if (!match.Success)
            {
                ModelState.AddModelError("Email", "Email is not valid");
                return View(user);
            }

            var prevUser = _context.Users.Any(x => x.Email == user.Email);
            if (prevUser)
            {
                ModelState.AddModelError("Email", "Email is used");
                ViewBag.Message = "کاربر با این ایمیل قبلا ثبت نام کرده است";

                return View("Index",user);
            }
            _context.Users.Add(user);
            _context.SaveChanges();
            ViewBag.Message = "ثبت نام با موقثیت انجام شد";
            return RedirectToAction("Index");
        }
        [HttpPost]
        public IActionResult Login(LoginViewModel user)
        {
            //if (!ModelState.IsValid) return View("Index",user);
            var foundUser = _context.Users.FirstOrDefault(x => x.Email == user.Email.Trim() && x.Password == user.Password.Trim());
            if (foundUser == null)
            {
                ModelState.AddModelError("Email", "Email or Password is not valid!");
                ViewBag.Message = "ایمیل یل ‍رمز ورود اشتباه است";
                return View(user);
            }
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.NameIdentifier, foundUser.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.Name, foundUser.FirstName));
            claims.Add(new Claim(ClaimTypes.Email, foundUser.Email));
            //if (foundUser.IsAdmin == true)
            //{
            //    claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            //}
            //else
            //{
            //    claims.Add(new Claim(ClaimTypes.Role, "User"));
            //}
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
            return Redirect("/");
        }
        
        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }
        public IActionResult RecoveryPassword()
        {
            return RedirectToAction("Login", "Account");
        }
    }
}
