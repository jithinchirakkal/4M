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




class FourMChangeSerializer(serializers.ModelSerializer):
    category_details = FourMCategoriesSerializer(source='category', read_only=True)
    action_details = FourMActionSerializer(source='action', read_only=True)
    shopfloor_name = serializers.CharField(source='shopfloor.name', read_only=True)
    line_name = serializers.CharField(source='line.name', read_only=True)
    station_name = serializers.CharField(source='station.name', read_only=True)
    approval_status = serializers.SerializerMethodField()
    approval_status = serializers.SerializerMethodField()
    class Meta:
        model = FourMChange
        fields = '__all__'

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
