using System;
using System.Collections.Generic;

namespace bookstore.Models;

public partial class Account
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Family { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Password { get; set; }

    public string? Address { get; set; }
}
