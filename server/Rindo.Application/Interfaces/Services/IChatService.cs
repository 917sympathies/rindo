﻿using Rindo.Domain.Common;
using Rindo.Domain.Entities;

namespace Application.Interfaces.Services;

public interface IChatService
{
    Task<Result<object>> GetChatById(Guid id);
}