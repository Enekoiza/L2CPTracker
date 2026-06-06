namespace L2CpTracker.Application.Common.Exceptions;

/// <summary>Thrown when a request fails business validation; mapped to 400 by the API.</summary>
public sealed class AppValidationException(string message) : Exception(message);

/// <summary>Thrown when a referenced entity does not exist; mapped to 404 by the API.</summary>
public sealed class NotFoundException(string message) : Exception(message);
