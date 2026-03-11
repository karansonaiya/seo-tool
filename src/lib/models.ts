import mongoose, { Schema, Document, Model } from "mongoose";

// ===========================================
// MongoDB Models
// ===========================================

/** User document interface */
export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  plan: "free" | "pro" | "enterprise";
  auditsThisMonth: number;
  maxAuditsPerMonth: number;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    auditsThisMonth: { type: Number, default: 0 },
    maxAuditsPerMonth: { type: Number, default: 5 },
    googleId: { type: String },
  },
  { timestamps: true }
);

/** Audit report document interface */
export interface IAuditReport extends Document {
  userId: string;
  url: string;
  overallScore: number;
  technicalScore: number;
  performanceScore: number;
  contentScore: number;
  issues: Array<{
    id: string;
    title: string;
    description: string;
    severity: string;
    category: string;
    fix?: string;
  }>;
  metaTags: Record<string, unknown>;
  headings: Record<string, unknown>;
  links: Record<string, unknown>;
  images: Record<string, unknown>;
  technical: Record<string, unknown>;
  performance: Record<string, unknown>;
  aiSuggestions: Array<Record<string, unknown>>;
  status: "queued" | "processing" | "completed" | "failed";
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

const AuditReportSchema = new Schema<IAuditReport>(
  {
    userId: { type: String, required: true, index: true },
    url: { type: String, required: true },
    overallScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },
    contentScore: { type: Number, default: 0 },
    issues: [
      {
        id: String,
        title: String,
        description: String,
        severity: String,
        category: String,
        fix: String,
      },
    ],
    metaTags: { type: Schema.Types.Mixed, default: {} },
    headings: { type: Schema.Types.Mixed, default: {} },
    links: { type: Schema.Types.Mixed, default: {} },
    images: { type: Schema.Types.Mixed, default: {} },
    technical: { type: Schema.Types.Mixed, default: {} },
    performance: { type: Schema.Types.Mixed, default: {} },
    aiSuggestions: [{ type: Schema.Types.Mixed }],
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },
    error: String,
    completedAt: Date,
  },
  { timestamps: true }
);

/** Monitored website document interface */
export interface IMonitoredSite extends Document {
  userId: string;
  url: string;
  name: string;
  lastAudit: Date;
  lastScore: number;
  scoreHistory: Array<{
    date: Date;
    overallScore: number;
    technicalScore: number;
    performanceScore: number;
    contentScore: number;
  }>;
  alerts: {
    scoreDropThreshold: number;
    notifyOnBrokenLinks: boolean;
    notifyOnPerformanceDrop: boolean;
    emailNotifications: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MonitoredSiteSchema = new Schema<IMonitoredSite>(
  {
    userId: { type: String, required: true, index: true },
    url: { type: String, required: true },
    name: { type: String, required: true },
    lastAudit: { type: Date },
    lastScore: { type: Number, default: 0 },
    scoreHistory: [
      {
        date: Date,
        overallScore: Number,
        technicalScore: Number,
        performanceScore: Number,
        contentScore: Number,
      },
    ],
    alerts: {
      scoreDropThreshold: { type: Number, default: 10 },
      notifyOnBrokenLinks: { type: Boolean, default: true },
      notifyOnPerformanceDrop: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Model factory to prevent model compilation errors during hot reload
function getModel<T extends Document>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}

export const User = getModel<IUser>("User", UserSchema);
export const AuditReport = getModel<IAuditReport>("AuditReport", AuditReportSchema);
export const MonitoredSite = getModel<IMonitoredSite>("MonitoredSite", MonitoredSiteSchema);
