﻿namespace Rindo.Domain.Entities;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
}