using System;
using System.Collections.Generic;

namespace bookstore.Models;

public partial class Book
{
    public string Id { get; set; } = null!;

    public string? BookName { get; set; }

    public string? Author { get; set; }

    public string? PublishedYear { get; set; }

    public DateTime CreateDate { get; set; }

    public decimal? Price { get; set; }

    public decimal? SpecialPrice { get; set; }
}
