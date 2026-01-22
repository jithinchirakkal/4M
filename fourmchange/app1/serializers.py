from rest_framework import serializers
from .models import FourMChange

#######   USER #######

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "code", "name"]


class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.name", read_only=True)
    role_code = serializers.CharField(source="role.code", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "name",
            "role",        # role ID (write)
            "role_name",   # readable
            "role_code",   # frontend-friendly
            "department",
            "profile_photo",
            "created_at",
            "created_by",
            "is_active",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["name"] = user.name
        token["role"] = user.role.code
        token["role_name"] = user.role.name
        token["department"] = user.department
        token["email"] = user.email
        return token

    def validate(self, attrs):
        attrs["username"] = attrs.get("email")
        data = super().validate(attrs)

        data["name"] = self.user.name
        data["role"] = self.user.role.code
        data["role_name"] = self.user.role.name
        data["department"] = self.user.department
        data["email"] = self.user.email
        data["user_id"] = self.user.id

        return data

#######   USER #######

from rest_framework import serializers
from .models import (
    Shopfloor, Line, Station,
    FourMCategories, FourMAction, FourMChange
)
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "code", "name"]


class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source="role.name", read_only=True)
    role_code = serializers.CharField(source="role.code", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "name",
            "role",        # role ID (write)
            "role_name",   # readable
            "role_code",   # frontend-friendly
            "department",
            "profile_photo",
            "created_at",
            "created_by",
            "is_active",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["name"] = user.name
        token["role"] = user.role.code
        token["role_name"] = user.role.name
        token["department"] = user.department
        token["email"] = user.email
        return token

    def validate(self, attrs):
        attrs["username"] = attrs.get("email")
        data = super().validate(attrs)

        data["name"] = self.user.name
        data["role"] = self.user.role.code
        data["role_name"] = self.user.role.name
        data["department"] = self.user.department
        data["email"] = self.user.email
        data["user_id"] = self.user.id

        return data


class ShopfloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shopfloor
        fields = '__all__'


class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = '__all__'


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'


class FourMActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FourMAction
        fields = '__all__'


class FourMCategoriesSerializer(serializers.ModelSerializer):
    actions = FourMActionSerializer(many=True, read_only=True)

    class Meta:
        model = FourMCategories
        fields = '__all__'


# class FourMChangeSerializer(serializers.ModelSerializer):
#     category_details = FourMCategoriesSerializer(source='category', read_only=True)
#     action_details = FourMActionSerializer(source='action', read_only=True)
#     shopfloor_name = serializers.CharField(source='shopfloor.name', read_only=True)
#     line_name = serializers.CharField(source='line.name', read_only=True)
#     station_name = serializers.CharField(source='station.name', read_only=True)
#     class Meta:
#         model = FourMChange
#         fields = '__all__'

############### set up approval  ###########


from .models import FourMApproval

class FourMApprovalSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name', read_only=True)
    role_code = serializers.CharField(source='role.code', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.name', read_only=True)
    
    class Meta:
        model = FourMApproval
        fields = [
            'id',
            'change',
            'role',
            'role_name',
            'role_code',
            'status',
            'approved_by',
            'approved_by_name',
            'remarks',
            'approved_at',
            'created_at',
        ]

############### set up approval  ###########
from .models import (
    FourMChange, 
    FourMApproval, 
    FourMCategories, 
    FourMAction, 
    RCR, 
    FourMChangeDetail, # <--- IMPORT THIS
    OJTRecord
)

class FourMChangeSerializer(serializers.ModelSerializer):
    category_details = FourMCategoriesSerializer(source='category', read_only=True)
    action_details = FourMActionSerializer(source='action', read_only=True)
    shopfloor_name = serializers.CharField(source='shopfloor.name', read_only=True)
    line_name = serializers.CharField(source='line.name', read_only=True)
    station_name = serializers.CharField(source='station.name', read_only=True)
    approval_status = serializers.SerializerMethodField()
    approval_status = serializers.SerializerMethodField()
    approvals = FourMApprovalSerializer(many=True, read_only=True)


    # --- 1. NEW STATUS FLAGS ---
    is_retro_done = serializers.SerializerMethodField()
    is_ojt_done = serializers.SerializerMethodField()         # Placeholder
    is_containment_done = serializers.SerializerMethodField() # Placeholder
    is_batch_done = serializers.SerializerMethodField()       # Placeholder
    is_tracking_done = serializers.SerializerMethodField()    # Placeholder

    class Meta:
        model = FourMChange
        fields = '__all__'

    # --- 2. LOGIC FOR RETROACTIVE (Implemented Now) ---
    def get_is_retro_done(self, obj):
        # In your RCR model, you set related_name='rcrs'
        # This checks if any RCR entry exists for this change
        # return obj.rcrs.exists()
        return RCR.objects.filter(change=obj).exists()
    
    def get_is_tracking_done(self, obj):
        # Checks if Tracking Sheet exists by matching the 'record_id' string
        if not obj.record_id:
            return False
        return FourMChangeDetail.objects.filter(record_id=obj.record_id).exists()

    # --- 3. LOGIC FOR FUTURE MODULES (Placeholders) ---
    
    def get_is_ojt_done(self, obj):
        """
        Checks if an OJT record exists for this change and if it is completed.
        'Completed' means status is no longer 'in_progress'.
        """
        # We check if there's any OJTRecord linked to this FourMChange 
        # that is not 'in_progress'
        return obj.ojt_records.filter(status__in=['pass', 'fail']).exists()

    def get_is_containment_done(self, obj):
        """
        Returns True only if:
        1. containment record exists
        2. AND is_complete == True
        """
        try:
            sheet = obj.tracking_sheet   # uses related_name='tracking_sheet'
            return sheet.is_complete
        except containment.DoesNotExist:
            return False

    # Optional: if you still want the old existence-only check (less strict)
    def get_is_tracking_done(self, obj):
        return hasattr(obj, 'tracking_sheet')

    def get_is_batch_done(self, obj):
        # Checks if 'batch_info' (related_name from model) exists
        return hasattr(obj, 'batch_info')

    def get_approval_status(self, obj):
        action = obj.action

        # No approval needed at all
        if not action or not action.set_up_approval:
            return "N/A"
        
        approvals = obj.approvals.all()
       
       # approval required but records not created
        if approvals.count() == 0:
            return "REQUIRED"

        # Any rejection
        if approvals.filter(status="rejected").exists():
            return "REJECTED"

        # Still waiting
        if approvals.filter(status="pending").exists():
            return "REQUIRED"

        # All approved
        return "APPROVED"
        




############### set up approval  ###########


from rest_framework import serializers
from .models import MaterialMovementCard, MaterialMovementRow

class MaterialMovementRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialMovementRow
        exclude = ['card']  # 'card' is set by the parent serializer

class MaterialMovementCardSerializer(serializers.ModelSerializer):
    rows = MaterialMovementRowSerializer(many=True)

    class Meta:
        model = MaterialMovementCard
        fields = [
            'id',
            'item_description',
            'part_no',
            'wire_size',
            'lot_no',
            'mat_grade',
            'dept_c',
            'wp_no',
            'created_at',
            'rows',
        ]

    def create(self, validated_data):
        rows_data = validated_data.pop('rows')
        card = MaterialMovementCard.objects.create(**validated_data)
        for row_data in rows_data:
            MaterialMovementRow.objects.create(card=card, **row_data)
        return card

    def update(self, instance, validated_data):
        rows_data = validated_data.pop('rows', None)
        # Update card fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if rows_data is not None:
            # Remove old rows and add new ones (simple approach)
            instance.rows.all().delete()
            for row_data in rows_data:
                MaterialMovementRow.objects.create(card=instance, **row_data)
        return instance  
    


# 4m track
from rest_framework import serializers
from .models import FourMCategory, FourMTracking, FourMChangeDetail

class FourMCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FourMCategory
        fields = ['id', 'name']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Category name cannot be empty.")
        return value

class FourMTrackingSerializer(serializers.ModelSerializer):
    category = FourMCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=FourMCategory.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model = FourMTracking
        fields = [
            'id', 'category', 'category_id', 'day', 'month', 'status', 'remarks'
        ]

    def validate_day(self, value):
        if value < 1 or value > 31:
            raise serializers.ValidationError("Day must be between 1 and 31.")
        return value

    def validate_status(self, value):
        valid_status = [choice[0] for choice in FourMTracking.STATUS_CHOICES]
        if value not in valid_status:
            raise serializers.ValidationError(f"Status must be one of {valid_status}.")
        return value

    def validate(self, data):
        # Ensure unique together constraint
        category = data.get('category') or self.instance.category
        day = data.get('day') or self.instance.day
        month = data.get('month') or self.instance.month
        if self.instance is None:
            if FourMTracking.objects.filter(category=category, day=day, month=month).exists():
                raise serializers.ValidationError("Tracking for this category, day, and month already exists.")
        else:
            if FourMTracking.objects.exclude(id=self.instance.id).filter(category=category, day=day, month=month).exists():
                raise serializers.ValidationError("Tracking for this category, day, and month already exists.")
        return data

class FourMChangeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = FourMChangeDetail
        fields = '__all__'

    def validate(self, data):
        # Example: date and time must be present
        if not data.get('date'):
            raise serializers.ValidationError({"date": "Date is required."})
        if not data.get('time'):
            raise serializers.ValidationError({"time": "Time is required."})
        return data  
 
 # man machine matrix
 
from .models import MatrixRow
    
class MatrixRowSerializer(serializers.ModelSerializer):
    sl_no = serializers.IntegerField(source='sequence_number', read_only=True)
    
    class Meta:
        model = MatrixRow
        fields = '__all__'
    
# control plan   
        
from .models import ControlPlan, ProcessDetail

class ProcessDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessDetail
        exclude = ['id', 'control_plan']

class ControlPlanSerializer(serializers.ModelSerializer):
    rows = ProcessDetailSerializer(many=True, allow_empty=True)

    class Meta:
        model = ControlPlan
        fields = '__all__'

    def create(self, validated_data):
        rows_data = validated_data.pop('rows')
        control_plan = ControlPlan.objects.create(**validated_data)
        for row_data in rows_data:
            ProcessDetail.objects.create(control_plan=control_plan, **row_data)
        return control_plan

    def update(self, instance, validated_data):
        rows_data = validated_data.pop('rows')
        
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
       
        instance.rows.all().delete()
        for row_data in rows_data:
            ProcessDetail.objects.create(control_plan=instance, **row_data)

        return instance
    
# Process flow

from .models import ProcessFlow, Process, Revision

class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
        exclude = ['process_flow']

class RevisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Revision
        exclude = ['process_flow']

class ProcessFlowSerializer(serializers.ModelSerializer):
    processes = ProcessSerializer(many=True, required=False)
    revisions = RevisionSerializer(many=True, required=False)
    
    class Meta:
        model = ProcessFlow
        fields = '__all__'
    
    def create(self, validated_data):
        processes_data = validated_data.pop('processes', [])
        revisions_data = validated_data.pop('revisions', [])
        
        # Create the ProcessFlow instance
        process_flow = ProcessFlow.objects.create(**validated_data)
        
        # Create Process instances
        for process_data in processes_data:
            Process.objects.create(process_flow=process_flow, **process_data)
        
        # Create Revision instances
        for revision_data in revisions_data:
            Revision.objects.create(process_flow=process_flow, **revision_data)
        
        return process_flow
    
    def update(self, instance, validated_data):
        processes_data = validated_data.pop('processes', None)
        revisions_data = validated_data.pop('revisions', None)
        
        # Update main ProcessFlow fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update processes (delete existing and recreate)
        if processes_data is not None:
            instance.processes.all().delete()
            for process_data in processes_data:
                Process.objects.create(process_flow=instance, **process_data)
        
        # Update revisions (delete existing and recreate)
        if revisions_data is not None:
            instance.revisions.all().delete()
            for revision_data in revisions_data:
                Revision.objects.create(process_flow=instance, **revision_data)
        
        return instance

    
# Retroactive Check Record (RCR)

from .models import RCR


class RCRSerializer(serializers.ModelSerializer):
    """
    Serializes all fields of the RCR model.
    """
    record_id = serializers.CharField(source="change.record_id", read_only=True)
    four_m_type = serializers.CharField(source="change.four_m", read_only=True)
    change_type = serializers.CharField(source="change.category.category_type", read_only=True)

    class Meta:
        model = RCR
        fields = "__all__" 

# Suspected Lot
from rest_framework import serializers
from .models import SuspectedLot

class SuspectedLotSerializer(serializers.ModelSerializer):
    """
    Serializes all fields of the SuspectedLot model.
    Includes related RCR information.
    """
    # Read-only fields from related RCR and its change record
    record_id = serializers.CharField(
        source="rcr.change.record_id", 
        read_only=True
    )
    four_m_type = serializers.CharField(
        source="rcr.change.four_m", 
        read_only=True
    )
    rcr_id = serializers.IntegerField(
        source="rcr.id", 
        read_only=True
    )
    
    class Meta:
        model = SuspectedLot
        fields = [
            'id',
            'rcr',
            'rcr_id',
            'record_id',
            'four_m_type',
            'date',
            'part_name',
            'change_type',
            'suspected_qty',
            'dispatch_date',
            'qty',
            'city',
            'invoice',
            'remarks',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

# IIC-SAR

from rest_framework import serializers
from .models import InspectionReport, ProcessParameter, InProcessParameter


class ProcessParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessParameter
        
        exclude = ("report",)


class InProcessParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = InProcessParameter
        exclude = ("report",)


class InspectionReportSerializer(serializers.ModelSerializer):
    process_parameters = ProcessParameterSerializer(many=True, required=False)
    inprocess_parameters = InProcessParameterSerializer(many=True, required=False)

    class Meta:
        model = InspectionReport
        fields = "__all__"


    def create(self, validated_data):
        proc_data = validated_data.pop("process_parameters", [])
        inproc_data = validated_data.pop("inprocess_parameters", [])

        report = InspectionReport.objects.create(**validated_data)

        for item in proc_data:
            ProcessParameter.objects.create(report=report, **item)
        for item in inproc_data:
            InProcessParameter.objects.create(report=report, **item)

        return report


    def update(self, instance, validated_data):
        proc_data = validated_data.pop("process_parameters", None)
        inproc_data = validated_data.pop("inprocess_parameters", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        
        if proc_data is not None:
            instance.process_parameters.all().delete()
            for item in proc_data:
                ProcessParameter.objects.create(report=instance, **item)

        if inproc_data is not None:
            instance.inprocess_parameters.all().delete()
            for item in inproc_data:
                InProcessParameter.objects.create(report=instance, **item)

        return instance

 
 # 4M Procedure 

from .models import ProcessInformation, FormatRecord

class ProcessInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessInformation
        fields = '__all__'


class FormatRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormatRecord
        fields = '__all__'


 # 4M Procedure 

 # 4M Validation


# from rest_framework import serializers
# from .models import ChangeValidation, ChangeValidationRow

# class ChangeValidationRowSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ChangeValidationRow
#         fields = '__all__'


# class ChangeValidationSerializer(serializers.ModelSerializer):
#     rows = ChangeValidationRowSerializer(many=True)

#     class Meta:
#         model = ChangeValidation
#         fields = '__all__'

#     def create(self, validated_data):
#         rows_data = validated_data.pop('rows', [])
#         validation = ChangeValidation.objects.create(**validated_data)
#         for row in rows_data:
#             ChangeValidationRow.objects.create(validation=validation, **row)
#         return validation

#     def update(self, instance, validated_data):
#         rows_data = validated_data.pop('rows', [])
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         for row in rows_data:
#             ChangeValidationRow.objects.create(validation=instance, **row)

#         return instance


from rest_framework import serializers
from .models import ChangeValidation, ChangeValidationRow

class ChangeValidationRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChangeValidationRow
        exclude = ['validation']  # Don't include validation field - it's set by parent

class ChangeValidationSerializer(serializers.ModelSerializer):
    rows = ChangeValidationRowSerializer(many=True)

    class Meta:
        model = ChangeValidation
        fields = '__all__'

    def create(self, validated_data):
        rows_data = validated_data.pop('rows', [])
        validation = ChangeValidation.objects.create(**validated_data)
        for row_data in rows_data:
            ChangeValidationRow.objects.create(validation=validation, **row_data)
        return validation

    def update(self, instance, validated_data):
        rows_data = validated_data.pop('rows', [])
        
        # Update the main validation object
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Replace all rows (delete old, create new)
        instance.rows.all().delete()
        for row_data in rows_data:
            ChangeValidationRow.objects.create(validation=instance, **row_data)
        
        return instance
 # 4M Validation



 








 # serializers.py

from rest_framework import serializers
from .models import OJTRecord, OJTDailyScore, FourMChange

class OJTDailyScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTDailyScore
        fields = [
            'id', 'day', 'date', 'plan', 'actual', 
            'production_marks', 'rejections', 'quality_marks',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['production_marks', 'quality_marks']
    
    def update(self, instance, validated_data):
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Recalculate marks
        instance.calculate_marks()
        return instance


class OJTRecordSerializer(serializers.ModelSerializer):
    daily_scores = OJTDailyScoreSerializer(many=True, read_only=True)
    
    class Meta:
        model = OJTRecord
        fields = [
            'id', 'four_m_change', 'change_record_id',
            'shopfloor_name', 'line_name', 'station_name',
            'department_name', 'process_name',
            'status', 'total_production_marks', 'total_quality_marks',
            'overall_marks', 'daily_scores',
            'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = [
            'four_m_change',
            'change_record_id', 'shopfloor_name', 'line_name', 'station_name',
            'status', 'total_production_marks', 'total_quality_marks',
            'overall_marks', 'completed_at'
        ]

    def create(self, validated_data):
        four_m_change = validated_data.pop('four_m_change')

        obj = OJTRecord.objects.create(
            four_m_change=four_m_change,
            change_record_id = four_m_change.record_id,
            shopfloor_name   = four_m_change.shopfloor.name   if four_m_change.shopfloor   else "",
            line_name        = four_m_change.line.name        if four_m_change.line        else "",
            station_name     = four_m_change.station.name     if four_m_change.station     else "",
            department_name  = validated_data.get('department_name', 'Production'),
            process_name     = validated_data.get('process_name',   'OJT Process'),
            **validated_data
        )

        # Auto-create 6 empty daily rows
        for day in range(1, 7):
            OJTDailyScore.objects.create(ojt_record=obj, day=day)

        return obj

class OJTRecordListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views"""
    class Meta:
        model = OJTRecord
        fields = [
            'id', 'change_record_id', 'status',
            'total_production_marks', 'total_quality_marks',
            'shopfloor_name', 'line_name', 'created_at'
        ]



#ID PSN /Batch

from .models import IdentificationPSN  # <--- Import the new model

# 1. New Serializer for the Form
class IdentificationPSNSerializer(serializers.ModelSerializer):
    record_id = serializers.CharField(source="change.record_id", read_only=True)
    
    class Meta:
        model = IdentificationPSN
        fields = '__all__'

#ID PSN /Batch end


# serializers.py
from .models import containment

class containmentSerializer(serializers.ModelSerializer):
    # Read-only computed fields
    change_info = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = containment
        fields = '__all__'
        read_only_fields = ['record_id', 'is_complete', 'completed_at']
    
    def get_change_info(self, obj):
        """Return basic info about linked FourMChange"""
        if obj.change:
            return {
                'record_id': obj.change.record_id,
                'four_m': obj.change.four_m,
                'date': obj.change.date,
                'shopfloor': obj.change.shopfloor.name if obj.change.shopfloor else None,
                'line': obj.change.line.name if obj.change.line else None,
                'station': obj.change.station.name if obj.change.station else None,
            }
        return None
    
    def get_completion_percentage(self, obj):
        """Calculate form completion percentage"""
        total_fields = 13  # Number of required fields
        filled_fields = sum([
            1 for field in [
                obj.potential_risk, obj.impact, obj.containment_action,
                obj.area_affected, obj.responsibility, obj.inspection_method,
                obj.acceptance_criteria, obj.trial_quantity, obj.defects_observed,
                obj.observations, obj.prepared_by, obj.reviewed_by, obj.approved_by
            ] if field and field.strip()
        ])
        return round((filled_fields / total_fields) * 100, 2)