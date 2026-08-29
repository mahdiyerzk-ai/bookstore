using System.ComponentModel.DataAnnotations;

namespace bookstore.Models
{
    public class About
    {
        [Key]
        public int Id { get; set; }

        //[Required]
        //[StringLength(50)]
        //public string PageName { get; set; } // "AboutUs" or "ContactUs"

        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [StringLength(100)]
        public string Address { get; set; }

        public string MetaDescription { get; set; }
        public string MetaKeywords { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;
    }
}

