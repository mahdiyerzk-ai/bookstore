using System.Globalization;

namespace bookstore.Models.ViewModels
{
    public class ShopIndexViewModel
    {
        public List<ShopCategoryItem> Categories { get; set; } = new();
        public List<ShopProductItem> Products { get; set; } = new();
    }

    public class ShopCategoryItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ProductCount { get; set; }
    }

    public class ShopProductItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Author { get; set; }
        public string? ISBN { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public bool InStock => StockQuantity > 0;
        public bool LowStock => StockQuantity > 0 && StockQuantity <= 5;

        // Falls back to a placeholder cover when the admin did not upload an image.
        public string CoverUrl =>
            string.IsNullOrWhiteSpace(ImageUrl) ? "/images/book-placeholder.svg" : ImageUrl!;
    }

    public static class PersianText
    {
        public static string ToPersianDigits(this string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            var chars = input.ToCharArray();
            for (var i = 0; i < chars.Length; i++)
            {
                if (chars[i] >= '0' && chars[i] <= '9')
                    chars[i] = (char)('۰' + (chars[i] - '0'));
            }
            return new string(chars);
        }

        public static string ToPersianDigits(this int value) =>
            value.ToString(CultureInfo.InvariantCulture).ToPersianDigits();

        // 290000 -> ۲۹۰,۰۰۰
        public static string ToTomanText(this decimal price) =>
            decimal.Truncate(price).ToString("N0", CultureInfo.InvariantCulture).ToPersianDigits();
    }
}
