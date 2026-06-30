namespace Trevvos.Neural.Application.Leads;

public sealed record CreateLeadRequest(
    string? Name,
    string? Email,
    string? Phone,
    string? CompanyName,
    string? InitialMessage
);

public sealed record UpdateLeadContactRequest(
    string? Name,
    string? Email,
    string? Phone,
    string? CompanyName
);

public sealed record AddLeadMessageRequest(
    string? Role,
    string Content
);

public sealed record ChangeLeadStatusRequest(
    string Status
);

public sealed record LeadMessageDto(
    Guid Id,
    string Role,
    string Content,
    DateTimeOffset CreatedAt
);

public sealed record LeadDto(
    Guid Id,
    string? Name,

    string? Email,

    string? Phone,

    string? CompanyName,

    string VisitorType,

    string Intent,

    string Temperature,

    string Status,

    string Source,

    string? Summary,

    string? RecommendedProduct,

    string? NextAction,

    DateTimeOffset CreatedAt,

    DateTimeOffset UpdatedAt,

    IReadOnlyCollection<LeadMessageDto> Messages
);

