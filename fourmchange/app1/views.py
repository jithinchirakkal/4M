
from django.shortcuts import render
from rest_framework import viewsets


#######   USER #######

from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Role
from .serializers import (
    UserSerializer,
    RoleSerializer,
    MyTokenObtainPairSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


# class RoleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Role.objects.filter(is_active=True)
#     serializer_class = RoleSerializer
#     permission_classes = [permissions.IsAuthenticated]

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.AllowAny] 


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


#######   USER #######



from .models import (
    Shopfloor, Line, Station,
    FourMCategories, FourMAction, FourMChange
)
from .serializers import (
    ShopfloorSerializer, LineSerializer, StationSerializer,
    FourMCategoriesSerializer, FourMActionSerializer, FourMChangeSerializer
)
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Role
from .serializers import (
    UserSerializer,
    RoleSerializer,
    MyTokenObtainPairSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


# class RoleViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Role.objects.filter(is_active=True)
#     serializer_class = RoleSerializer
#     permission_classes = [permissions.IsAuthenticated]

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.AllowAny] 

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ShopfloorViewSet(viewsets.ModelViewSet):
    queryset = Shopfloor.objects.all()
    serializer_class = ShopfloorSerializer


class LineViewSet(viewsets.ModelViewSet):
    queryset = Line.objects.all()
    serializer_class = LineSerializer

    def get_queryset(self):
        queryset = Line.objects.all()
        shopfloor_id = self.request.query_params.get('shopfloor', None)
        if shopfloor_id:
            queryset = queryset.filter(shopfloor_id=shopfloor_id)
        return queryset


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

    def get_queryset(self):
        queryset = Station.objects.all()
        line_id = self.request.query_params.get('line', None)
        if line_id:
            queryset = queryset.filter(line_id=line_id)
        return queryset


class FourMCategoriesViewSet(viewsets.ModelViewSet):
    queryset = FourMCategories.objects.all()
    serializer_class = FourMCategoriesSerializer

    def get_queryset(self):
        queryset = FourMCategories.objects.all()
        category_type = self.request.query_params.get('category_type', None)
        four_m = self.request.query_params.get('four_m')

        if category_type:
            queryset = queryset.filter(category_type=category_type)
        if four_m:
            queryset = queryset.filter(four_m=four_m)
        return queryset


class FourMActionViewSet(viewsets.ModelViewSet):
    queryset = FourMAction.objects.all()
    serializer_class = FourMActionSerializer

    def get_queryset(self):
        queryset = FourMAction.objects.all()
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


# class FourMChangeViewSet(viewsets.ModelViewSet):
#     queryset = FourMChange.objects.all().order_by('-created_at')
#     serializer_class = FourMChangeSerializer



# class FourMChangeViewSet(viewsets.ModelViewSet):
#     queryset = FourMChange.objects.all().order_by('-created_at')
#     serializer_class = FourMChangeSerializer

#     def perform_create(self, serializer):
#         change = serializer.save()

#         action = change.action
#         if action and action.set_up_approval and action.approving_authority:
#             authorities = action.approving_authority.replace('&', '/').split('/')

#             for auth in authorities:
#                 role_code = auth.strip().upper().replace(" ", "_")
#                 try:
#                     role = Role.objects.get(code=role_code)
#                     FourMApproval.objects.get_or_create(
#                         change=change,
#                         role=role
#                     )
#                 except Role.DoesNotExist:
#                     pass

#             change.status = 'pending_approval'
#             change.save()

# from .models import FourMApproval
# from .serializers import FourMApprovalSerializer

# class FourMChangeViewSet(viewsets.ModelViewSet):
#     queryset = FourMChange.objects.all().order_by('-created_at')
#     serializer_class = FourMChangeSerializer

#     def perform_create(self, serializer):
#         change = serializer.save()

#         action = change.action
#         if not action or not action.set_up_approval:
#             return

#         authority_text = (action.approving_authority or "").upper()

#         role_codes = set()
#         if "PROD" in authority_text:
#             role_codes.add("PROD_HOD")
#         if "QA" in authority_text:
#             role_codes.add("QA_HOD")

#         for role_code in role_codes:
#             try:
#                 role = Role.objects.get(code=role_code)
#                 FourMApproval.objects.get_or_create(
#                     change=change,
#                     role=role
#                 )
#             except Role.DoesNotExist:
#                 pass


from django.contrib.auth import get_user_model
from .models import FourMApproval, Role
from .serializers import FourMApprovalSerializer
from .utils.email import send_customer_approval_email  # Adjust path if needed

User = get_user_model()

class FourMChangeViewSet(viewsets.ModelViewSet):
    queryset = FourMChange.objects.all().order_by('-created_at')
    serializer_class = FourMChangeSerializer

    def perform_create(self, serializer):
        change = serializer.save()
        action = change.action

        if not action or not action.set_up_approval:
            return

        authority_text = (action.approving_authority or "").upper()

        role_codes = set()
        if "PROD" in authority_text:
            role_codes.add("PROD_HOD")
        if "QA" in authority_text:
            role_codes.add("QA_HOD")

        for role_code in role_codes:
            try:
                role = Role.objects.get(code=role_code)
                FourMApproval.objects.get_or_create(change=change, role=role)
            except Role.DoesNotExist:
                pass

        # Handle Customer Approval
        if action.customer_approval:
            try:
                customer_role = Role.objects.get(code='CUSTOMER')
                FourMApproval.objects.get_or_create(change=change, role=customer_role)

                # Send email to all customer approvers
                customer_users = User.objects.filter(role=customer_role)
                for customer in customer_users:
                    if customer.email:
                        send_customer_approval_email(customer.email, change.record_id)
            except Role.DoesNotExist:
                pass

    
############### set up approval  ###########
  

from rest_framework.decorators import action
from django.utils import timezone

# class FourMApprovalViewSet(viewsets.ModelViewSet):
#     queryset = FourMApproval.objects.all().order_by('-created_at')
#     serializer_class = FourMApprovalSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user

#         # Admin sees all approvals
#         if user.is_superuser:
#             return FourMApproval.objects.all()

#         # Role-based approvals
#         return FourMApproval.objects.filter(
#             role=user.role,
#             status='pending'
#         )

#     @action(detail=True, methods=['post'])
#     def approve(self, request, pk=None):
#         approval = self.get_object()

#         if approval.role != request.user.role:
#             return Response(
#                 {"error": "You are not authorized to approve this record"},
#                 status=status.HTTP_403_FORBIDDEN
#             )

#         approval.status = 'approved'
#         approval.approved_by = request.user
#         approval.approved_at = timezone.now()
#         approval.remarks = request.data.get('remarks', '')
#         approval.save()

#         # Check if all approvals are completed
#         pending_exists = approval.change.approvals.filter(status='pending').exists()
#         if not pending_exists:
#             approval.change.status = 'approved'
#             approval.change.save()

#         return Response(
#             FourMApprovalSerializer(approval).data,
#             status=status.HTTP_200_OK
#         )

#     @action(detail=True, methods=['post'])
#     def reject(self, request, pk=None):
#         approval = self.get_object()

#         if approval.role != request.user.role:
#             return Response(
#                 {"error": "You are not authorized to reject this record"},
#                 status=status.HTTP_403_FORBIDDEN
#             )

#         approval.status = 'rejected'
#         approval.approved_by = request.user
#         approval.approved_at = timezone.now()
#         approval.remarks = request.data.get('remarks', '')
#         approval.save()

#         approval.change.status = 'rejected'
#         approval.change.save()

#         return Response(
#             FourMApprovalSerializer(approval).data,
#             status=status.HTTP_200_OK
#         )

# views.py - Add this NEW ViewSet for Customer Approvals
# views.py - Update FourMApprovalViewSet

class FourMApprovalViewSet(viewsets.ModelViewSet):
    queryset = FourMApproval.objects.all().order_by('-created_at')
    serializer_class = FourMApprovalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Admin sees all approvals EXCEPT customer approvals
        if user.is_superuser:
            return FourMApproval.objects.exclude(role__code='CUSTOMER')

        # If user is a customer, return empty queryset for main approvals page
        # (They should use CustomerApprovalsPage instead)
        if user.role and user.role.code == 'CUSTOMER':
            return FourMApproval.objects.none()

        # # For Prod HOD and QA HOD - show only their pending approvals
        # # Exclude customer approvals
        # return FourMApproval.objects.filter(
        #     role=user.role,
        #     status='pending'
        # ).exclude(role__code='CUSTOMER')
        
        # For Prod HOD and QA HOD
        # CHANGE: Removed status='pending' so we get History too
        return FourMApproval.objects.filter(
            role=user.role
        ).exclude(role__code='CUSTOMER')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        approval = self.get_object()

        # Prevent customers from using this endpoint
        if approval.role.code == 'CUSTOMER':
            return Response(
                {"error": "Customer approvals must be done through the customer portal"},
                status=status.HTTP_403_FORBIDDEN
            )

        if approval.role != request.user.role:
            return Response(
                {"error": "You are not authorized to approve this record"},
                status=status.HTTP_403_FORBIDDEN
            )

        approval.status = 'approved'
        approval.approved_by = request.user
        approval.approved_at = timezone.now()
        approval.remarks = request.data.get('remarks', '')
        approval.save()

        # Check if all approvals are completed
        pending_exists = approval.change.approvals.filter(status='pending').exists()
        if not pending_exists:
            approval.change.status = 'approved'
            approval.change.save()

        return Response(
            FourMApprovalSerializer(approval).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        approval = self.get_object()

        # Prevent customers from using this endpoint
        if approval.role.code == 'CUSTOMER':
            return Response(
                {"error": "Customer approvals must be done through the customer portal"},
                status=status.HTTP_403_FORBIDDEN
            )

        if approval.role != request.user.role:
            return Response(
                {"error": "You are not authorized to reject this record"},
                status=status.HTTP_403_FORBIDDEN
            )

        approval.status = 'rejected'
        approval.approved_by = request.user
        approval.approved_at = timezone.now()
        approval.remarks = request.data.get('remarks', '')
        approval.save()

        approval.change.status = 'rejected'
        approval.change.save()

        return Response(
            FourMApprovalSerializer(approval).data,
            status=status.HTTP_200_OK
        )
# views.py - Update CustomerApprovalViewSet with proper permission checks

class CustomerApprovalViewSet(viewsets.ModelViewSet):
    """
    Separate ViewSet specifically for Customer Approvals
    Only accessible by users with CUSTOMER role
    """
    queryset = FourMApproval.objects.all().order_by('-created_at')
    serializer_class = FourMApprovalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # CRITICAL: Only users with CUSTOMER role can see customer approvals
        if not user.role or user.role.code != 'CUSTOMER':
            return FourMApproval.objects.none()  # Return empty queryset

        # Only show customer approvals for actual customers
        return FourMApproval.objects.filter(
            role__code='CUSTOMER'
        )

    def list(self, request, *args, **kwargs):
        """Override list to add explicit permission check"""
        if not request.user.role or request.user.role.code != 'CUSTOMER':
            return Response(
                {"error": "Access denied. Customer approvals are only visible to customer users."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to add explicit permission check"""
        if not request.user.role or request.user.role.code != 'CUSTOMER':
            return Response(
                {"error": "Access denied. Customer approvals are only visible to customer users."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        approval = self.get_object()

        # Verify this is a customer approval
        if approval.role.code != 'CUSTOMER':
            return Response(
                {"error": "This endpoint is only for customer approvals"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verify user has customer role
        if not request.user.role or request.user.role.code != 'CUSTOMER':
            return Response(
                {"error": "Only customers can approve these requests"},
                status=status.HTTP_403_FORBIDDEN
            )

        approval.status = 'approved'
        approval.approved_by = request.user
        approval.approved_at = timezone.now()
        approval.remarks = request.data.get('remarks', '')
        approval.save()

        return Response(
            FourMApprovalSerializer(approval).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        approval = self.get_object()

        # Verify this is a customer approval
        if approval.role.code != 'CUSTOMER':
            return Response(
                {"error": "This endpoint is only for customer approvals"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verify user has customer role
        if not request.user.role or request.user.role.code != 'CUSTOMER':
            return Response(
                {"error": "Only customers can reject these requests"},
                status=status.HTTP_403_FORBIDDEN
            )

        approval.status = 'rejected'
        approval.approved_by = request.user
        approval.approved_at = timezone.now()
        approval.remarks = request.data.get('remarks', '')
        approval.save()

        return Response(
            FourMApprovalSerializer(approval).data,
            status=status.HTTP_200_OK
        )



############### set up approval  ###########


from rest_framework import viewsets
from .models import MaterialMovementCard
from .serializers import MaterialMovementCardSerializer

class MaterialMovementCardViewSet(viewsets.ModelViewSet):
    queryset = MaterialMovementCard.objects.all()
    serializer_class = MaterialMovementCardSerializer   



# 4m track views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import FourMCategory, FourMTracking, FourMChangeDetail
from .serializers import (
    FourMCategorySerializer,
    FourMTrackingSerializer,
    FourMChangeDetailSerializer
)

class FourMCategoryViewSet(viewsets.ModelViewSet):
    queryset = FourMCategory.objects.all()
    serializer_class = FourMCategorySerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as exc:
            return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except ValidationError as exc:
            return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)

class FourMTrackingViewSet(viewsets.ModelViewSet):
    queryset = FourMTracking.objects.select_related('category').all()
    serializer_class = FourMTrackingSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as exc:
            return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except ValidationError as exc:
            return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)

class FourMChangeDetailViewSet(viewsets.ModelViewSet):
    queryset = FourMChangeDetail.objects.all()
    serializer_class = FourMChangeDetailSerializer

    # def create(self, request, *args, **kwargs):
    #     try:
    #         return super().create(request, *args, **kwargs)
    #     except ValidationError as exc:
    #         return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)
    def create(self, request, *args, **kwargs):
        try:
            # 1. Grab the ID text from your frontend form
            record_id = request.data.get('record_id')
            
            # 2. Find the "Parent" Change Request
            # We use filter().last() to be safe against duplicates
            parent_change = FourMChange.objects.filter(record_id=record_id).last()
            
            # 3. Prepare the data
            data = request.data.copy()
            
            # If we found the parent, save the link! 
            # If not (maybe a typo?), we just skip the link, but still save the record.
            if parent_change:
                data['change'] = parent_change.id
            
            # 4. Save normally
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except ValidationError as exc:
            return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except ValidationError as exc:
            return Response({'error': exc.detail}, status=status.HTTP_400_BAD_REQUEST)
        

from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .models import MatrixRow
from .serializers import MatrixRowSerializer
from django.db.models import Max

class ManMachineMatrixViewSet(ModelViewSet):
    queryset = MatrixRow.objects.all().order_by('sequence_number')
    serializer_class = MatrixRowSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({'error': 'Expected a list of items'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        
        last_seq = MatrixRow.objects.aggregate(
            max_seq=Max('sequence_number')
        )['max_seq'] or 0

        
        for i, item in enumerate(data, start=1):
            item['sequence_number'] = last_seq + i

        serializer = self.get_serializer(data=data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, 
                      status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        
        self.get_queryset().delete()
        return Response({'status': 'All records deleted'},
                      status=status.HTTP_204_NO_CONTENT)
 
# control plan 
        
from .models import ControlPlan
from .serializers import ControlPlanSerializer

class ControlPlanViewSet(viewsets.ModelViewSet):
    queryset = ControlPlan.objects.all().order_by('-id')
    serializer_class = ControlPlanSerializer
    
# process flow

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProcessFlow, Process, Revision
from .serializers import ProcessFlowSerializer, ProcessSerializer, RevisionSerializer

class ProcessFlowViewSet(viewsets.ModelViewSet):
    queryset = ProcessFlow.objects.all().order_by('-created_at')
    serializer_class = ProcessFlowSerializer
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent process flows"""
        recent_flows = ProcessFlow.objects.all()[:10]
        serializer = self.get_serializer(recent_flows, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def export_pdf(self, request, pk=None):
        """Export process flow as PDF (placeholder)"""
        process_flow = self.get_object()
        return Response({
            'message': 'PDF export functionality',
            'process_flow_id': pk,
            'part_name': process_flow.part_name
        })

class ProcessViewSet(viewsets.ModelViewSet):
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer
    
    def get_queryset(self):
        queryset = Process.objects.all()
        process_flow_id = self.request.query_params.get('process_flow_id')
        if process_flow_id:
            queryset = queryset.filter(process_flow_id=process_flow_id)
        return queryset.order_by('s_no')

class RevisionViewSet(viewsets.ModelViewSet):
    queryset = Revision.objects.all()
    serializer_class = RevisionSerializer
    
    def get_queryset(self):
        queryset = Revision.objects.all()
        process_flow_id = self.request.query_params.get('process_flow_id')
        if process_flow_id:
            queryset = queryset.filter(process_flow_id=process_flow_id)
        return queryset

    
# Retroactive Check Record (RCR)

from rest_framework import viewsets
from .models import RCR
from .serializers import RCRSerializer


class RCRViewSet(viewsets.ModelViewSet):

    queryset = RCR.objects.all()
    serializer_class = RCRSerializer

# Suspected Lot
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SuspectedLot, RCR
from .serializers import SuspectedLotSerializer

class SuspectedLotViewSet(viewsets.ModelViewSet):
    queryset = SuspectedLot.objects.all()
    serializer_class = SuspectedLotSerializer
    
    @action(detail=False, methods=['get'])
    def pending_rcrs(self, request):
        # Get all RCR IDs that already have suspected lot records
        completed_rcr_ids = SuspectedLot.objects.values_list('rcr_id', flat=True)
        
        # Get RCRs that don't have suspected lot records
        pending_rcrs = RCR.objects.exclude(
            id__in=completed_rcr_ids
        ).select_related('change', 'change__category')
        
        # Serialize the pending RCRs
        pending_data = []
        for rcr in pending_rcrs:
            pending_data.append({
                'id': rcr.id,
                'record_id': rcr.change.record_id if rcr.change else None,
                'four_m': rcr.change.four_m if rcr.change else None,
                'category_type': rcr.change.category.category_type if rcr.change and rcr.change.category else None,
                'part_name_number': rcr.part_name_number,
                'type_of_change': rcr.type_of_change,
                'date': rcr.date,
                'reject_qty': rcr.reject_qty,
                'lot_qty': rcr.lot_qty,
            })
        
        return Response(pending_data)

# IIC-SAR

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import InspectionReport, ProcessParameter, InProcessParameter
from .serializers import (
    InspectionReportSerializer,
    ProcessParameterSerializer,
    InProcessParameterSerializer,
)


class InspectionReportViewSet(viewsets.ModelViewSet):
    queryset = InspectionReport.objects.all().order_by("-created_at")
    serializer_class = InspectionReportSerializer

    @action(detail=False, url_path="submitted_reports")
    def submitted_reports(self, request):
        
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)


class ProcessParameterViewSet(viewsets.ModelViewSet):
    queryset = ProcessParameter.objects.all()
    serializer_class = ProcessParameterSerializer


class InProcessParameterViewSet(viewsets.ModelViewSet):
    queryset = InProcessParameter.objects.all()
    serializer_class = InProcessParameterSerializer


 
 # 4M Procedure 

from .models import ProcessInformation, FormatRecord
from .serializers import ProcessInformationSerializer, FormatRecordSerializer

class ProcessInformationViewSet(viewsets.ModelViewSet):
    queryset = ProcessInformation.objects.all()
    serializer_class = ProcessInformationSerializer

class FormatRecordViewSet(viewsets.ModelViewSet):
    queryset = FormatRecord.objects.all()
    serializer_class = FormatRecordSerializer

  
 # 4M Procedure 

 # 4M Validation

from .models import ChangeValidation
from .serializers import ChangeValidationSerializer

class ChangeValidationViewSet(viewsets.ModelViewSet):
    queryset = ChangeValidation.objects.all().order_by('-date')
    serializer_class = ChangeValidationSerializer

 # 4M Validation



 



















from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import OJTRecord, OJTDailyScore, FourMChange
from .serializers import (
    OJTRecordSerializer, 
    OJTRecordListSerializer,
    OJTDailyScoreSerializer
)
class OJTRecordViewSet(viewsets.ModelViewSet):
    queryset = OJTRecord.objects.all()
    serializer_class = OJTRecordSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        change_id = self.request.query_params.get('change_id')     # ← string like REC-20250115-003
        if change_id:
            qs = qs.filter(change_record_id=change_id)
        return qs
    @action(detail=False, methods=['post'])
    def create_from_change(self, request):
        record_id = request.data.get('four_m_change_record_id')
        
        # 1. Find the 4M Change record
        change = get_object_or_404(FourMChange, record_id=record_id)

        # 2. Search for an EXISTING OJT record for this change
        existing_ojt = OJTRecord.objects.filter(four_m_change=change).first()
        
        if existing_ojt:
            # Return the existing data (with your scores!) instead of creating new
            serializer = self.get_serializer(existing_ojt)
            return Response(serializer.data, status=200)

        # 3. If no existing record, create it
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(four_m_change=change, created_by=request.user if request.user.is_authenticated else None)
        
        return Response(serializer.data, status=201)





    @action(detail=True, methods=['patch'])
    def update_daily_score(self, request, pk=None):
        """
        Update a specific day's score
        PATCH /api/ojt-records/{id}/update_daily_score/
        Body: {
            "day": 1,
            "date": "2024-01-15",
            "plan": 100,
            "actual": 95,
            "rejections": 2
        }
        """
        ojt_record = self.get_object()
        day = request.data.get('day')
        
        if not day or day < 1 or day > 6:
            return Response(
                {'error': 'Day must be between 1 and 6'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            daily_score = OJTDailyScore.objects.get(
                ojt_record=ojt_record,
                day=day
            )
        except OJTDailyScore.DoesNotExist:
            return Response(
                {'error': 'Daily score not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = OJTDailyScoreSerializer(
            daily_score,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            
            # Return updated OJT record
            ojt_serializer = OJTRecordSerializer(ojt_record)
            return Response(ojt_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # @action(detail=True, methods=['post'])
    # def submit(self, request, pk=None):
    #     """
    #     Submit OJT record and finalize status
    #     POST /api/ojt-records/{id}/submit/
    #     """
    #     ojt_record = self.get_object()
        
    #     # Recalculate totals and status
    #     ojt_record.update_totals()
    #     final_status = ojt_record.calculate_status()
        
    #     serializer = OJTRecordSerializer(ojt_record)
    #     return Response({
    #         'message': f'OJT record submitted with status: {final_status}',
    #         'data': serializer.data
    #     })


class OJTDailyScoreViewSet(viewsets.ModelViewSet):
    queryset = OJTDailyScore.objects.all()
    serializer_class = OJTDailyScoreSerializer
    
    def get_queryset(self):
        queryset = OJTDailyScore.objects.all()
        
        # Filter by OJT record
        ojt_record_id = self.request.query_params.get('ojt_record', None)
        if ojt_record_id:
            queryset = queryset.filter(ojt_record_id=ojt_record_id)
        
        return queryset




# ID PSN / Batch

# views.py
from .models import IdentificationPSN
from .serializers import IdentificationPSNSerializer

class IdentificationPSNViewSet(viewsets.ModelViewSet):
    queryset = IdentificationPSN.objects.all().order_by('-created_at')
    serializer_class = IdentificationPSNSerializer

# ID PSN Batch end


# views.py
from .models import containment
from .serializers import containmentSerializer

class containmentViewSet(viewsets.ModelViewSet):
    queryset = containment.objects.all()
    serializer_class = containmentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by record_id
        record_id = self.request.query_params.get('record_id', None)
        if record_id:
            queryset = queryset.filter(record_id=record_id)
        
        # Filter by completion status
        is_complete = self.request.query_params.get('is_complete', None)
        if is_complete is not None:
            queryset = queryset.filter(is_complete=is_complete.lower() == 'true')
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def create_or_update(self, request):
        """
        Create or update tracking sheet by record_id.
        Frontend sends record_id + form data.
        """
        record_id = request.data.get('record_id')
        
        if not record_id:
            return Response(
                {'error': 'record_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get the parent FourMChange
            change = FourMChange.objects.get(record_id=record_id)
        except FourMChange.DoesNotExist:
            return Response(
                {'error': f'FourMChange with record_id {record_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get or create tracking sheet
        tracking_sheet, created = containment.objects.get_or_create(
            change=change,
            defaults={'record_id': record_id}
        )
        
        # Update with request data
        serializer = self.get_serializer(tracking_sheet, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Created' if created else 'Updated',
            'data': serializer.data
        }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def by_record_id(self, request):
        """Get tracking sheet by record_id"""
        record_id = request.query_params.get('record_id')
        
        if not record_id:
            return Response(
                {'error': 'record_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            sheet = containment.objects.get(record_id=record_id)
            serializer = self.get_serializer(sheet)
            return Response(serializer.data)
        except containment.DoesNotExist:
            return Response(
                {'error': f'Tracking sheet for {record_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
#Sheet data
from .models import SetupSheetEntry
from .serializers import SetupSheetSerializer

class SetupSheetViewSet(viewsets.ModelViewSet):
    queryset = SetupSheetEntry.objects.all()
    serializer_class = SetupSheetSerializer
    
    # Allow filtering so we can find sheets by Change ID
    filterset_fields = ['change']

    def perform_create(self, serializer):
        serializer.save(filled_by=self.request.user)

#Sheet data end