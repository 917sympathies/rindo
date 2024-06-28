﻿using Application.Interfaces.Services;
using Application.Services.UserService;
using Rindo.Domain.Entities;
using Rindo.Domain.Repositories;
using Rindo.Infrastructure.Models;
using Task = System.Threading.Tasks.Task;

namespace Application.Services.IChatMessageService;

public class MessageService : IMessageService
{
    private readonly IChatMessageRepository _messageRepository;
    private readonly IUserService _userService;
    private readonly RindoDbContext _context;
    
    public MessageService(IChatMessageRepository messageRepository, IUserService userService, RindoDbContext context)
    {
        _messageRepository = messageRepository;
        _userService = userService;
        _context = context;
    }
    public async Task<Tuple<string, string>> AddMessage(Guid userId, Guid chatId, string content)
    {
        var user = (await _userService.GetUserById(userId)).Value;
        var msg = new ChatMessage() { ChatId = chatId, SenderId = userId, Content = content, Username = user!.Username};
        await _messageRepository.AddMessage(msg);
        await _context.SaveChangesAsync();
        return new Tuple<string, string>(user.Username, msg.Id.ToString());
    }
}