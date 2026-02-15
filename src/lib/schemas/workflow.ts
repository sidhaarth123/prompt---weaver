import { z } from "zod";

/**
 * Workflow Request Schema
 * Canonical contract for all generator requests (image/video/website)
 */
export const WorkflowRequestSchema = z.object({
    type: z.enum(["image", "video", "website"]),
    requestId: z.string().uuid(),
    userId: z.string().uuid(),
    timestamp: z.string().datetime(),
    inputs: z.record(z.any()), // Generator-specific fields
});

export type WorkflowRequest = z.infer<typeof WorkflowRequestSchema>;

/**
 * Workflow Response Schema
 * Strict contract for n8n responses
 */
export const WorkflowResponseSchema = z.object({
    requestId: z.string().uuid(),
    status: z.enum(["succeeded", "failed"]),
    result: z
        .object({
            jsonPrompt: z.record(z.any()).optional(),
            blueprint: z.record(z.any()).optional(),
            humanReadable: z.string().optional(),
        })
        .optional(),
    error: z
        .object({
            code: z.string(),
            message: z.string(),
        })
        .optional(),
});

export type WorkflowResponse = z.infer<typeof WorkflowResponseSchema>;

/**
 * Workflow Status Schema
 * Database representation of workflow execution
 */
export const WorkflowStatusSchema = z.object({
    requestId: z.string().uuid(),
    userId: z.string().uuid(),
    type: z.enum(["image", "video", "website"]),
    status: z.enum(["queued", "running", "succeeded", "failed"]),
    inputJson: z.record(z.any()).optional(),
    outputJson: z.record(z.any()).optional(),
    errorCode: z.string().optional(),
    errorMessage: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;
