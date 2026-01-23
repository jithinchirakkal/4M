import {
	LayoutDashboard,
	FileText,
	Package,
	Activity,
	Shield,
	Settings,
	Globe,
	Clock,
	AlertTriangle,
	Database,
	FileCheck,
	ClipboardList,
	FileCog,
	CheckCircle,
	Search,
	Bell,
	CheckSquare,
	Tag,
} from "lucide-react";

interface NavModule {
	id: string;
	title: string;
	fullName: string;
	color: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
	description: string;
	status: "active" | "development" | "beta";
	allowedRoles?: string[];
	
}

export const navModules: NavModule[] = [
	{
		id: "dashboard",
		title: "Dashboard",
		fullName: "System Overview",
		color: "from-slate-500 to-slate-600",
		icon: LayoutDashboard,
		description: "Central hub for system analytics and overview",
		status: "active",
	},
	{
		id: "cm",
		title: "Change Management",
		fullName: "Change Management Sheet",
		color: "from-blue-500 to-blue-600",
		icon: FileText,
		description: "Manage and track change requests and approvals",
		status: "active",
	},
	{
		id: "approvals",
		title: "Approvals",
		fullName: "Approvals",
		color: "from-blue-500 to-blue-600",
		icon: CheckSquare,
		description: "Manage and track change requests and approvals",
		status: "active",
		allowedRoles: ["PROD_HOD", "QA_HOD"],
	},
	{
		id: "mmc",
		title: "Material Movement",
		fullName: "Material Management Control",
		color: "from-green-500 to-green-600",
		icon: Package,
		description:
			"Control and monitor material specifications and movements",
		status: "active",
	},
	{
		id: "4m-cts",
		title: "4M Tracking Sheet",
		fullName: "4M Change Tracking System",
		color: "from-purple-500 to-purple-600",
		icon: Activity,
		description:
			"Real-time tracking of 4M (Man, Machine, Material, Method) changes",
		status: "active",
	},
	{
		id: "cpf",
		title: "Control Plans",
		fullName: "Control Plan Framework Sheet",
		color: "from-indigo-500 to-indigo-600",
		icon: Shield,
		description:
			"Framework for creating and managing quality control plans",
		status: "active",
	},
	{
		id: "mcs",
		title: "Machine Check Sheet",
		fullName: "Manufacturing Control System",
		color: "from-pink-500 to-pink-600",
		icon: Settings,
		description: "Oversee and control manufacturing processes",
		status: "active",
	},
	{
		id: "pf",
		title: "Process Flow",
		fullName: "Process Flow Diagram Sheet",
		color: "from-teal-500 to-teal-600",
		icon: Globe,
		description: "Visualize and optimize process flow diagrams",
		status: "active",
	},
	{
		id: "rcr",
		title: "Retroactive Check",
		fullName: "Retroactive Check Record Sheet",
		color: "from-orange-500 to-orange-600",
		icon: Clock,
		description: "Verify and record historical changes",
		status: "active",
	},
	{
		id: "iic-sar",
		title: "In-Process Inspection / Setting Approval",
		fullName: "Incident Investigation Control",
		color: "from-red-500 to-red-600",
		icon: AlertTriangle,
		description: "Investigate and manage incident reports",
		status: "active",
	},
	{
		id: "mmm",
		title: "Machine Matrix",
		fullName: "Manufacturing Management Module",
		color: "from-cyan-500 to-cyan-600", // KEPT: Distinct from new sky blue
		icon: Database,
		description: "Manage man-machine matrix for manufacturing",
		status: "active",
	},
	{
		id: "cdb",
		title: "Change Display",
		fullName: "Change Display Board",
		color: "from-sky-500 to-sky-600", // CHANGED: Unique color
		icon: FileCheck,
		description: "Display and monitor change statuses",
		status: "active",
	},
	{
		id: "4m",
		title: "4M-Responsibility",
		fullName: "4M Change Responsibility",
		color: "from-emerald-500 to-emerald-600", // CHANGED: Unique color
		icon: ClipboardList,
		description: "Assign and track 4M change responsibilities",
		status: "active",
	},
	{
		id: "4MP",
		title: "4M-Procedure",
		fullName: "4M Change Procedure",
		color: "from-violet-500 to-violet-600", // CHANGED: Unique color
		icon: FileCog,
		description: "Define and manage 4M change procedures",
		status: "active",
	},
	{
		id: "valid",
		title: "4M-Validation",
		fullName: "4M Change Validation",
		color: "from-lime-500 to-lime-600", // CHANGED: Unique color
		icon: CheckCircle,
		description: "Validate 4M change implementations",
		status: "active",
	},
	{
		id: "sps",
		title: "Suspected Lot",
		fullName: "Suspected Lot Traceability Record",
		color: "from-amber-500 to-amber-600", // CHANGED: Unique color
		icon: Search,
		description: "Track and manage suspected lot records",
		status: "active",
	},
	{
		id: "CIN",
		title: "Change Intimation Note",
		fullName: "Change Intimation Note",
		color: "from-fuchsia-500 to-fuchsia-600", // CHANGED: Unique color
		icon: Bell,
		description: "Notify stakeholders of changes via intimation notes",
		status: "active",
	},
	{
		id: "4m-method",
		title: "Methods",
		fullName: "Method Module",
		color: "from-gray-500 to-gray-600", // CHANGED: Unique color
		icon: Settings,
		description: "Manage categories, actions, and activities",
		status: "active",
	},
		{
		id: "ojt",
		title: "OJT",
		fullName: "OJT Sheet",
		color: "from-gray-500 to-gray-600", // CHANGED: Unique color
		icon: Settings,
		description: "On Job Training",
		status: "active",
	},
	
		
	{
	id: "product-sheet",
	title: "Product Characteristics",
	fullName: "Product Characteristics Check Sheet",
	color: "from-fuchsia-500 to-pink-600",
	icon: CheckCircle,
	description: "Monitor and verify product quality characteristics during assembly",
	status: "active",
    }, 
	{
	id: "tool-sheet",
	title: "Perishable Tool",
	fullName: "Perishable Tool Change Frequency Check Sheet",
	color: "from-rose-500 to-rose-600",
	icon: Settings, 
	description: "Track and manage perishable tool change frequency and maintenance",
	status: "active",
    }  
	,
	{
		id: "process-sheet",
		title: "process-characteritics",
		fullName: "process-characteritics",
		color: "from-gray-500 to-gray-600", // CHANGED: Unique color
		icon: Settings,
		description: "process-characteritics",
		status: "active",
		
	},
	{
		id: "paint-sheet",
		title: "Paintshop Quality Checksheet",
		fullName: "process-characteritics",
		color: "from-gray-500 to-gray-600", // CHANGED: Unique color
		icon: Settings,
		description: "process-characteritics",
		status: "active",
		
	},
	{
		id: "users",
		title: "User-Management",
		fullName: "User Management",
		color: "from-gray-500 to-gray-600", // CHANGED: Unique color
		icon: Settings,
		description: "process-characteritics",
		status: "active",
	},
	{
		id: "customer-approvals",
		title: "Customer Approvals ",
		fullName: "Customer Approvals",
		color: "from-gray-500 to-gray-600", // CHANGED: Unique color
		icon: Settings,
		description: "process-characteritics",
		status: "active",
		allowedRoles: ["CUSTOMER"],
		
	},
	{
        id: "identification", // This MUST match the ID used in ChangeRequestDetail.tsx
        title: "Identification / Batch",
        fullName: "Identification & Batch Control",
        color: "from-cyan-500 to-cyan-600",
        icon: Tag,
        description: "Manage Batch Nos, PSN, and Identification methods",
        status: "active",
    },
	{
        id: "containment-form",
        title: "Containment Plan",
        fullName: "4M Containment & Risk Assessment",
        color: "from-orange-400 to-red-500", // A distinct warm gradient
        icon: ClipboardList,
        description: "Define containment actions, risk levels, and trial validations",
        status: "active",
    },
	{
        id: "FourMChangeHistory",
        title: "FourMChangeHistory",
        fullName: "FourMChangeHistory",
        color: "from-orange-400 to-red-500", // A distinct warm gradient
        icon: ClipboardList,
        description: "Define containment actions, risk levels, and trial validations",
        status: "active",
    },
];
