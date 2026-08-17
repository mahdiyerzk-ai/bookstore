using System;
using System.Collections.Generic;

namespace bookstore.Models;

public partial class Favourite
{
    public int Id { get; set; }

    public string? Stars { get; set; }

    public int UserId { get; set; }

    public int BookId { get; set; }
}
