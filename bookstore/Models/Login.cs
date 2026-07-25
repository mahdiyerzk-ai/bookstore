using System.Globalization;

namespace bookstore.Models
{
    public class Login
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }

        
        
    }
}
