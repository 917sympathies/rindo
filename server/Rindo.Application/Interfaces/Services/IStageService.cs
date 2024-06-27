﻿using Rindo.Domain.Common;
using Rindo.Domain.DTO;
using Rindo.Domain.Entities;
using Task = System.Threading.Tasks.Task;

namespace Application.Services.StageService;

public interface IStageService
{
    Task<Result> AddStage(StageOnCreateDto stageDto);
    Task<Result> DeleteStage(Guid id);
    Task<Result<string>> GetStageName(Guid stageId);
    Task<IEnumerable<Stage>> GetStagesByProjectId(Guid projectId);
    Task<Result> ChangeStageTask(Guid id, Guid taskId);
}