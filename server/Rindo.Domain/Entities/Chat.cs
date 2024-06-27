﻿namespace Rindo.Domain.Entities;

public class Chat
{
    public Guid Id { get; set;}
    public Guid ProjectId { get; set; }
    public IEnumerable<ChatMessage> Messages { get; set; } = default!;
}