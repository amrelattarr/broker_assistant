using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BackEnd.DTOs
{
    public sealed class FlexibleTimeSpanConverter : JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                var text = reader.GetString();
                if (string.IsNullOrWhiteSpace(text))
                {
                    return default;
                }

                // Try common formats: HH:mm:ss, HH:mm, H:mm, etc.
                // TimeSpan.Parse supports many formats, but we guard to provide a clearer failure.
                if (TimeSpan.TryParse(text, CultureInfo.InvariantCulture, out var value))
                {
                    return value;
                }

                // Try explicit formats
                string[] formats = { "hh\\:mm\\:ss", "h\\:mm\\:ss", "hh\\:mm", "h\\:mm", "mm\\:ss" };
                foreach (var format in formats)
                {
                    if (TimeSpan.TryParseExact(text, format, CultureInfo.InvariantCulture, out value))
                    {
                        return value;
                    }
                }

                throw new JsonException($"Invalid TimeSpan value: '{text}'. Expected formats like 'HH:mm' or 'HH:mm:ss'.");
            }

            if (reader.TokenType == JsonTokenType.Number)
            {
                // Interpret numeric seconds if a number is provided
                if (reader.TryGetInt64(out var totalSeconds))
                {
                    return TimeSpan.FromSeconds(totalSeconds);
                }
            }

            throw new JsonException($"Unexpected token parsing TimeSpan. Token: {reader.TokenType}");
        }

        public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
        {
            // Standardize serialization to HH:mm:ss
            writer.WriteStringValue(value.ToString("hh\\:mm\\:ss", CultureInfo.InvariantCulture));
        }
    }
}


