import { formatContentValidationReport, validateDocumentationContent } from "../lib/contentGraph/validateContentGraph";

const report = validateDocumentationContent();

console.log(formatContentValidationReport(report));

if (!report.isValid) {
    process.exitCode = 1;
}