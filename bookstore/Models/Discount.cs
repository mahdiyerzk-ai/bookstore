using System;
using System.Collections.Generic;

namespace bookstore.Models;

public partial class Discount
{
    public int Id { get; set; }

    public int DiscountId { get; set; }

    public int ProductId { get; set; }
}
