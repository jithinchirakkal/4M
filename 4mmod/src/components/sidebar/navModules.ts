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
  Bell
} from 'lucide-react';

interface NavModule {
  id: string;
  title: string;
  fullName: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  status: 'active' | 'development' | 'beta';
}

export const navModules: NavModule[] = [
  { 
    id: 'dashboard', 
    title: 'Dashboard', 
    fullName: 'System Overview', 
    color: 'from-slate-500 to-slate-600',
    icon: LayoutDashboard,
    description: 'Central hub for system analytics and overview',
    status: 'active'
  },
  { 
    id: 'cm', 
    title: 'Change Management', 
    fullName: 'Change Management Sheet', 
    color: 'from-blue-500 to-blue-600',
    icon: FileText,
    description: 'Manage and track change requests and approvals',
    status: 'active'
  },
  { 
    id: 'mmc', 
    title: 'Material Movement', 
    fullName: 'Material Management Control', 
    color: 'from-green-500 to-green-600',
    icon: Package,
    description: 'Control and monitor material specifications and movements',
    status: 'active'
  },
  { 
    id: '4m-cts', 
    title: '4M-CTS', 
    fullName: '4M Change Tracking System', 
    color: 'from-purple-500 to-purple-600',
    icon: Activity,
    description: 'Real-time tracking of 4M (Man, Machine, Material, Method) changes',
    status: 'beta'
  },
  { 
    id: 'cpf', 
    title: 'Control Plans', 
    fullName: 'Control Plan Framework Sheet', 
    color: 'from-indigo-500 to-indigo-600',
    icon: Shield,
    description: 'Framework for creating and managing quality control plans',
    status: 'active'
  },
  { 
    id: 'mcs', 
    title: 'MCS', 
    fullName: 'Manufacturing Control System', 
    color: 'from-pink-500 to-pink-600',
    icon: Settings,
    description: 'Oversee and control manufacturing processes',
    status: 'development'
  },
  { 
    id: 'pf', 
    title: 'Process Flow', 
    fullName: 'Process Flow Diagram Sheet', 
    color: 'from-teal-500 to-teal-600',
    icon: Globe,
    description: 'Visualize and optimize process flow diagrams',
    status: 'active'
  },
  { 
    id: 'rcr', 
    title: 'Retroactive Check', 
    fullName: 'Retroactive Check Record Sheet', 
    color: 'from-orange-500 to-orange-600',
    icon: Clock,
    description: 'Verify and record historical changes',
    status: 'active'
  },
  { 
    id: 'iic-sar', 
    title: 'IIC-SAR', 
    fullName: 'Incident Investigation Control', 
    color: 'from-red-500 to-red-600',
    icon: AlertTriangle,
    description: 'Investigate and manage incident reports',
    status: 'beta'
  },
  { 
    id: 'mmm', 
    title: 'Machine Matrix', 
    fullName: 'Manufacturing Management Module', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Database,
    description: 'Manage man-machine matrix for manufacturing',
    status: 'development'
  },
  { 
    id: 'cdb', 
    title: 'Change Display', 
    fullName: 'Change Display Board', 
    color: 'from-cyan-500 to-cyan-600',
    icon: FileCheck,
    description: 'Display and monitor change statuses',
    status: 'active'
  },
  { 
    id: '4m', 
    title: '4M-Responsibility', 
    fullName: '4M Change Responsibility', 
    color: 'from-cyan-500 to-cyan-600',
    icon: ClipboardList,
    description: 'Assign and track 4M change responsibilities',
    status: 'development'
  },
  { 
    id: '4MP', 
    title: '4M-Procedure', 
    fullName: '4M Change Procedure', 
    color: 'from-cyan-500 to-cyan-600',
    icon: FileCog,
    description: 'Define and manage 4M change procedures',
    status: 'beta'
  },
  { 
    id: 'valid', 
    title: '4M-Validation', 
    fullName: '4M Change Validation', 
    color: 'from-cyan-500 to-cyan-600',
    icon: CheckCircle,
    description: 'Validate 4M change implementations',
    status: 'active'
  },
  { 
    id: 'sps', 
    title: 'Suspected Lot', 
    fullName: 'Suspected Lot Traceability Record', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Search,
    description: 'Track and manage suspected lot records',
    status: 'development'
  },
  { 
    id: 'CIN', 
    title: 'Change Intimation Note', 
    fullName: 'Change Intimation Note', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Bell,
    description: 'Notify stakeholders of changes via intimation notes',
    status: 'active'
  }
];