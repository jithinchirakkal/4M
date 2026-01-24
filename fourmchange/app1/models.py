from django.db import models
from django.utils import timezone


##########    USER ##########

from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    use_in_migrations = True
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")

        role = extra_fields.get("role")
        if isinstance(role, int) or isinstance(role, str):
            from .models import Role
            extra_fields["role"] = Role.objects.get(id=role)

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class Role(models.Model):
    code = models.CharField(max_length=30, unique=True, editable=False)
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.name.upper().replace(" ", "_")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="users"
    )

    department = models.CharField(max_length=100)
    profile_photo = models.ImageField(upload_to="profile_photos/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "role", "department"]

    objects = UserManager()

    def __str__(self):
        return self.email


#######   USER #######


class Shopfloor(models.Model):
    # Define the available sheet types
    SHEET_TYPE_CHOICES = [
        ('PRODUCT', 'Product Characteristics (Assembly)'),
        ('PROCESS', 'Process Check (Oven/Molding)'),
        ('PAINT', 'Paint Quality Sheet'),
        ('TOOLING', 'Perishable Tooling Sheet'),
    ]

    name = models.CharField(max_length=100, unique=True)

    # ✅ NEW CONFIGURATION FIELD
    # This lets the Admin choose which sheet triggers for this shopfloor
    sheet_type = models.CharField(
        max_length=20, 
        choices=SHEET_TYPE_CHOICES, 
        default='PRODUCT',
        help_text="Which Setup Verification sheet should be used for this shopfloor?"
    )

    def __str__(self):
        return self.name


class Line(models.Model):
    shopfloor = models.ForeignKey(Shopfloor, on_delete=models.CASCADE, related_name='lines')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('shopfloor', 'name')

    def __str__(self):
        return f"{self.shopfloor.name} - {self.name}"


class Station(models.Model):
    line = models.ForeignKey(Line, on_delete=models.CASCADE, related_name='stations')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('line', 'name')

    def __str__(self):
        return f"{self.line.name} - {self.name}"


# ----------------------------- 4M Change Form ----------------------------- #
class FourMCategories(models.Model):

    FOUR_M_CHOICES = [
        ('Man','Man'),
        ('Machine/Tool','Machine/Tool'),
        ('Material','Material'),
        ('Method','Method'),
    ]

    four_m = models.CharField(max_length=20, choices=FOUR_M_CHOICES)

    CATEGORY_CHOICES = [
        ('Planned', 'Planned'),
        ('Unplanned', 'Unplanned'),
        ('Abnormal', 'Abnormal'),
    ]
    category_type = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(help_text="Definition")

    def __str__(self):
        return f"{self.category_type} - {self.description[:40]}"


class FourMAction(models.Model):
    category = models.ForeignKey(FourMCategories, on_delete=models.CASCADE, related_name='actions')
    action_taken = models.TextField()
    set_up_approval = models.BooleanField(default=False)
    retroactive_inspection = models.BooleanField(default=False)
    suspected_lot_check = models.BooleanField(default=False)
    change_record = models.BooleanField(default=False)
    identification_psn_batch_no = models.BooleanField(default=False)
    ojt = models.BooleanField(default=False)
    containment_action = models.BooleanField(default=False)
    approving_authority = models.TextField(blank=True, null=True)
    customer_approval = models.BooleanField(default=False)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.category.description[:30]} → {self.action_taken[:30]}"


class FourMChange(models.Model):
    FOUR_M_CHOICES = [
        ('Man', 'Man'),
        ('Machine/Tool', 'Machine/Tool'),
        ('Material', 'Material'),
        ('Method', 'Method'),
    ]     
    SHIFT_CHOICES = [
        ('A', 'Shift A'),
        ('B', 'Shift B'),
    ]           
    shopfloor = models.ForeignKey(Shopfloor, on_delete=models.CASCADE, null=True, blank=True)
    line = models.ForeignKey(Line, on_delete=models.CASCADE, null=True, blank=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=True, blank=True)
    four_m = models.CharField(max_length=20, choices=FOUR_M_CHOICES)
    shift = models.CharField(max_length=1, choices=SHIFT_CHOICES, default='A')
    category = models.ForeignKey(FourMCategories, on_delete=models.CASCADE, null=True, blank=True)
    action = models.ForeignKey(FourMAction, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    record_id = models.CharField(max_length=30, unique=True, editable=False)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.record_id:
            today_str = timezone.now().strftime("%Y%m%d")
            last_record = FourMChange.objects.filter(record_id__startswith=f"REC-{today_str}").order_by('-id').first()
            seq = 1
            if last_record:
                try:
                    seq = int(last_record.record_id.split('-')[-1]) + 1
                except:
                    seq = 1
            self.record_id = f"REC-{today_str}-{seq:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.record_id} - {self.four_m} - {self.category.category_type}"


############### set up approval  ############

class FourMApproval(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    change = models.ForeignKey(
        FourMChange,
        on_delete=models.CASCADE,
        related_name='approvals'
    )

    # ROLE who must approve (Prod HOD / QA HOD)
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name='fourm_approvals'
    )

    # USER who actually approved
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_fourm_changes'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    remarks = models.TextField(blank=True, null=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('change', 'role')

    def __str__(self):
        return f"{self.change.record_id} - {self.role.name} - {self.status}"


############### set up approval  ###########

from django.db import models

class MaterialMovementCard(models.Model):
    # customer = models.CharField(max_length=200)
    # doc_no = models.CharField(max_length=50, blank=True)
    # rev_no = models.CharField(max_length=50, blank=True)
    # rev_date = models.DateField(null=True, blank=True)
    item_description = models.CharField(max_length=200)
    part_no = models.CharField(max_length=100)
    wire_size = models.CharField(max_length=50, blank=True)
    lot_no = models.CharField(max_length=50, blank=True)
    mat_grade = models.CharField(max_length=50, blank=True)
    dept_c = models.CharField(max_length=50, blank=True)
    wp_no = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
    return f"{self.item_description} ({self.part_no})"


class MaterialMovementRow(models.Model):
    card = models.ForeignKey(MaterialMovementCard, related_name='rows', on_delete=models.CASCADE)
    proc_req = models.CharField(max_length=100, blank=True)
    process_name = models.CharField(max_length=100, blank=True)
    mc_no = models.CharField(max_length=50, blank=True)
    date = models.DateField(null=True, blank=True)
    shift = models.CharField(max_length=1, choices=[('A', 'Morning'), ('B', 'Evening'), ('C', 'Night')], blank=True)
    change_info = models.CharField(max_length=200, blank=True)
    opr_sign = models.CharField(max_length=100, blank=True)
    qa_sign = models.CharField(max_length=100, blank=True)
    net_wt = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"Row for {self.card} - {self.process_name}"
    


# 4m track
from django.db import models

class FourMCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class FourMTracking(models.Model):
    STATUS_CHOICES = [
        ('noplan', 'No Plan'),
        ('nochange', 'No Change'),
        ('change', 'Change'),
    ]
    category = models.ForeignKey(FourMCategory, on_delete=models.CASCADE, related_name='trackings')
    day = models.PositiveSmallIntegerField()  # 1-31
    month = models.DateField()  # Store as first day of month (e.g., 2024-07-01)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='noplan')
    remarks = models.CharField(max_length=255, blank=True, null=True)
    class Meta:
        unique_together = ('category', 'day', 'month')

    def __str__(self):
        return f"{self.category.name} - Day {self.day} - {self.month} - {self.status}"

# class FourMChangeDetail(models.Model):
#     date = models.DateField()
#     time = models.TimeField()
#     mc_no = models.CharField(max_length=50, blank=True, null=True)
#     change_description = models.TextField(blank=True, null=True)
#     nature_of_change = models.TextField(blank=True, null=True)
#     action_taken = models.TextField(blank=True, null=True)
#     part_name_no = models.CharField(max_length=100, blank=True, null=True)
#     control_no = models.CharField(max_length=100, blank=True, null=True)
#     lot_no_batch_no = models.CharField(max_length=100, blank=True, null=True)
#     tracking_no_serial = models.CharField(max_length=100, blank=True, null=True)
#     retro_qty = models.CharField(max_length=50, blank=True, null=True)
#     retro_wh_no = models.CharField(max_length=50, blank=True, null=True)
#     retro_assy = models.CharField(max_length=50, blank=True, null=True)
#     retro_moog = models.CharField(max_length=50, blank=True, null=True)
#     retro_cust = models.CharField(max_length=50, blank=True, null=True)
#     retro_ott_pn = models.CharField(max_length=50, blank=True, null=True)
#     containment_assy = models.CharField(max_length=50, blank=True, null=True)
#     containment_ship = models.CharField(max_length=50, blank=True, null=True)
#     containment_lot_invoice = models.CharField(max_length=100, blank=True, null=True)
#     sl_op = models.CharField(max_length=50, blank=True, null=True)
#     sl_production = models.CharField(max_length=50, blank=True, null=True)
#     sl_plant_impl = models.CharField(max_length=50, blank=True, null=True)
#     material_details_1 = models.CharField(max_length=100, blank=True, null=True)
#     material_details_2 = models.CharField(max_length=100, blank=True, null=True)
#     remarks = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return f"Change Detail {self.date} {self.time}"  

# models.py - Updated FourMChangeDetail model
# changed FourMchangeDetail model
class FourMChangeDetail(models.Model):
    # --- ADD THIS LINK ---
    change = models.ForeignKey(
        FourMChange, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='tracking_details' # This name allows the serializer to find it
    )
    # ---------------------
    
    SHIFT_CHOICES = [
        ('A', 'Shift A'),
        ('B', 'Shift B'),
    ]
    
    NATURE_OF_CHANGE_CHOICES = [
        ('Man', 'Man'),
        ('Machine/Tool', 'Machine/Tool'),
        ('Material', 'Material'),
        ('Method', 'Method'),
    ]
    
    CATEGORY_TYPE_CHOICES = [
        ('Planned', 'Planned'),
        ('Unplanned', 'Unplanned'),
        ('Abnormal', 'Abnormal'),
    ]
    
    # Basic Information
    record_id = models.CharField(max_length=30, blank=True, null=True)
    date = models.DateField()
    shift = models.CharField(max_length=1, choices=SHIFT_CHOICES, default='A')
    time = models.TimeField()
    model = models.CharField(max_length=100, blank=True, null=True)
    station = models.CharField(max_length=100, blank=True, null=True)
    line = models.CharField(max_length=100, blank=True, null=True)
    
    # Nature of Change
    nature_of_change = models.CharField(max_length=20, choices=NATURE_OF_CHANGE_CHOICES, blank=True, null=True)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPE_CHOICES, blank=True, null=True)
    change_description = models.TextField(blank=True, null=True)
    
    # Informed To (Multiple Choice - Boolean fields)
    informed_maintenance = models.BooleanField(default=False)
    informed_quality = models.BooleanField(default=False)
    informed_production = models.BooleanField(default=False)
    informed_others = models.BooleanField(default=False)
    
    # Customer Approval & Action
    customer_approval_required = models.BooleanField(default=False)
    action_taken = models.TextField(blank=True, null=True)
    
    # Applicability of Checklist
    applicability_retro = models.BooleanField(default=False)
    applicability_setup = models.BooleanField(default=False)
    applicability_containment = models.BooleanField(default=False)
    
    # Setup
    setup_total_qty = models.CharField(max_length=50, blank=True, null=True)
    setup_ok_qty = models.CharField(max_length=50, blank=True, null=True)
    setup_ng_qty = models.CharField(max_length=50, blank=True, null=True)
    
    # Retro Check (Before Change)
    retrocheck_total_qty = models.CharField(max_length=50, blank=True, null=True)
    retrocheck_ok_qty = models.CharField(max_length=50, blank=True, null=True)
    retrocheck_ng_qty = models.CharField(max_length=50, blank=True, null=True)
    
    # Containment Check (After Change)
    containmentcheck_total_qty = models.CharField(max_length=50, blank=True, null=True)
    containmentcheck_ok_qty = models.CharField(max_length=50, blank=True, null=True)
    containmentcheck_ng_qty = models.CharField(max_length=50, blank=True, null=True)
    
    # Traceability & Approvals
    traceability = models.CharField(max_length=200, blank=True, null=True)
    action_taken_on_ng_parts = models.CharField(max_length=200, blank=True, null=True)
    production_approval = models.CharField(max_length=100, blank=True, null=True)
    quality_approval = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ('date', 'time', 'shift', 'record_id')

    def __str__(self):
        return f"Change Detail {self.record_id} - {self.date} {self.time} Shift {self.shift}"  
    



# man machine matrix

class MatrixRow(models.Model):
    operator = models.CharField(max_length=100)
    blanking = models.BooleanField(default=False)
    bending = models.BooleanField(default=False)
    punching = models.BooleanField(default=False)
    draw = models.BooleanField(default=False)
    trimming = models.BooleanField(default=False)
    mig_welding = models.BooleanField(default=False)
    tig_welding = models.BooleanField(default=False)
    projection_welding = models.BooleanField(default=False)
    remarks = models.TextField(blank=True, null=True)
    prepared_by = models.CharField(max_length=100)
    approved_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    sequence_number = models.PositiveIntegerField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.sequence_number:
            last_seq = MatrixRow.objects.all().aggregate(Max('sequence_number'))['sequence_number__max']
            self.sequence_number = (last_seq or 0) + 1
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.sequence_number} - {self.operator}"

    class Meta:
        ordering = ['-created_at']
 
 # control plan       
        
class ControlPlan(models.Model):

    controlPlanNo = models.CharField(max_length=255, blank=True)
    keyContact = models.CharField(max_length=255, blank=True)
    dateOrig = models.CharField(max_length=255, blank=True)
    dateRev = models.CharField(max_length=255, blank=True)
    prototype = models.BooleanField(default=False)
    prelaunch = models.BooleanField(default=False)
    production = models.BooleanField(default=False)
    coreTeam = models.CharField(max_length=255, blank=True)
    customerEngApprovalDate = models.CharField(max_length=255, blank=True)
    refPartNo = models.CharField(max_length=255, blank=True)
    partNoLatestChangeLevel = models.CharField(max_length=255, blank=True)
    supplierPlantApprovalDate = models.CharField(max_length=255, blank=True)
    customerQuantityApprovalDate = models.CharField(max_length=255, blank=True)
    partNameDescription = models.CharField(max_length=255, blank=True)
    otherApprovalDateIfReqd1 = models.CharField(max_length=255, blank=True)
    otherApprovalDate1 = models.CharField(max_length=255, blank=True)
    supplierPlant = models.CharField(max_length=255, blank=True)
    otherApprovalDateIfReqd2 = models.CharField(max_length=255, blank=True)
    otherApprovalDate2 = models.CharField(max_length=255, blank=True)
    legend = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    

    preparedBy = models.CharField(max_length=255, blank=True)
    checkedBy = models.CharField(max_length=255, blank=True)
    approvedBy = models.CharField(max_length=255, blank=True)
    formatNo = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return self.controlPlanNo or f"Control Plan #{self.pk}"

class ProcessDetail(models.Model):
    control_plan = models.ForeignKey(ControlPlan, related_name='rows', on_delete=models.CASCADE)
    partProcessNo = models.CharField(max_length=255, blank=True)
    processNameOperationDescription = models.CharField(max_length=255, blank=True)
    machineDeviceJigToolsForMfg = models.CharField(max_length=255, blank=True)
    no = models.CharField(max_length=255, blank=True)
    productCharacteristics = models.CharField(max_length=255, blank=True)
    processCharacteristics = models.CharField(max_length=255, blank=True)
    specialCharClass = models.CharField(max_length=255, blank=True)
    productProcessSpec = models.CharField(max_length=255, blank=True)
    toleranceControlSpec = models.CharField(max_length=255, blank=True)
    evaluationMeasurementTechnique = models.CharField(max_length=255, blank=True)
    sampleSize = models.CharField(max_length=255, blank=True)
    sampleFreq = models.CharField(max_length=255, blank=True)
    periodicalResp = models.CharField(max_length=255, blank=True)
    primaryResp = models.CharField(max_length=255, blank=True)
    controlMethod = models.CharField(max_length=255, blank=True)
    record = models.CharField(max_length=255, blank=True)
    reactionPlan = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"Process for {self.control_plan.controlPlanNo or 'N/A'}"
    
# Process Flow

class ProcessFlow(models.Model):
    part_name = models.CharField(max_length=255)
    part_number = models.CharField(max_length=255)
    organization_name = models.CharField(max_length=255)
    customer_name = models.CharField(max_length=255)
    doc_no = models.CharField(max_length=255, blank=True)
    rev_date = models.DateField(null=True, blank=True)
    rev_no = models.CharField(max_length=50, blank=True)
    prepared_by = models.CharField(max_length=255, blank=True)
    approved_by = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.part_name} - {self.part_number}"

class Process(models.Model):
    process_flow = models.ForeignKey(ProcessFlow, related_name='processes', on_delete=models.CASCADE)
    s_no = models.PositiveIntegerField()
    process_no = models.CharField(max_length=100, blank=True)
    move = models.CharField(max_length=100, blank=True)
    store = models.CharField(max_length=100, blank=True)
    operation = models.CharField(max_length=100, blank=True)
    delay = models.CharField(max_length=100, blank=True)
    process_description = models.TextField(blank=True)
    product_characteristics = models.TextField(blank=True)
    process_characteristics = models.TextField(blank=True)

    class Meta:
        ordering = ['s_no']

    def __str__(self):
        return f"Step {self.s_no} - {self.process_description[:30]}"

class Revision(models.Model):
    SYMBOL_CHOICES = [
        ('operation', 'Operation'),
        ('transportation', 'Transportation'),
        ('inspection', 'Inspection'),
        ('operationInspection', 'Operation + Inspection'),
        ('delay', 'Delay'),
        ('storage', 'Storage'),
        ('', 'None'),
    ]
    
    process_flow = models.ForeignKey(ProcessFlow, related_name='revisions', on_delete=models.CASCADE)
    revision = models.CharField(max_length=50)
    date = models.DateField(null=True, blank=True)
    change_description = models.TextField(blank=True)
    approved_by_supplier = models.CharField(max_length=255, blank=True)
    approved_by_customer = models.CharField(max_length=255, blank=True)
    symbol = models.CharField(max_length=30, choices=SYMBOL_CHOICES, blank=True)

    def __str__(self):
        return f"Rev {self.revision} - {self.change_description[:30]}"

    
# Retroactive Check Record (RCR)

from django.utils import timezone


class RCR(models.Model):
    
    change = models.ForeignKey(FourMChange, on_delete=models.CASCADE, related_name="rcrs", null=True, blank=True)
    date = models.DateField(default=timezone.now)
    part_name_number = models.CharField(max_length=200)
    type_of_change = models.CharField(max_length=200)
    inspected_by = models.CharField(max_length=100)

    # ----- QUANTITY INFO -----
    lot_qty = models.PositiveIntegerField(default=0)
    ok_qty = models.PositiveIntegerField(default=0)
    reject_qty = models.PositiveIntegerField(default=0)
    rework_qty = models.PositiveIntegerField(default=0)

    # ----- TECHNICAL SPEC -----
    parameter = models.CharField(max_length=200, blank=True)
    specification = models.TextField(blank=True)
    inspection_method = models.CharField(max_length=200, blank=True)

    # ----- OBSERVATIONS -----
    observation1 = models.TextField(blank=True)
    observation2 = models.TextField(blank=True)
    observation3 = models.TextField(blank=True)
    observation4 = models.TextField(blank=True)
    observation5 = models.TextField(blank=True)


    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"RCR-{self.pk} | {self.part_name_number}"

# Suspected Lot 

from django.db import models
from django.utils import timezone

class SuspectedLot(models.Model):   
    rcr = models.ForeignKey(
        'RCR', 
        on_delete=models.CASCADE, 
        related_name="suspected_lots",
        null=True,
        blank=True
    )
    # Basic Information (auto-populated from RCR)
    date = models.DateField(default=timezone.now, help_text="Date of change/incident")
    part_name = models.CharField(max_length=200, help_text="Part Name/Model")
    change_type = models.CharField(
        max_length=200, 
        help_text="Change Type: Planned/Unplanned/Abnormal")
    # Suspected Quantity Information
    suspected_qty = models.PositiveIntegerField(
        default=0, 
        help_text="Total suspected quantity")
    # Dispatch Information
    dispatch_date = models.DateField(
        null=True, 
        blank=True,
        help_text="Date of dispatch")
    qty = models.PositiveIntegerField(
        default=0, 
        help_text="Quantity dispatched/affected")
    # Customer/Location Information
    city = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Customer city"
    )
    invoice = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Invoice/Reference number"
    )
    
    # Additional Information
    remarks = models.TextField(
        blank=True,
        help_text="Containment remarks or additional notes"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Suspected Lot Record"
        verbose_name_plural = "Suspected Lot Records"

    def __str__(self):
        return f"Suspected-{self.pk} | {self.part_name} | {self.suspected_qty} pcs"

# IIC-SAR

class InspectionReport(models.Model):
    # Part Information
    part_name = models.CharField(max_length=200)
    part_number = models.CharField(max_length=100)
    customer = models.CharField(max_length=200)
    operation_name = models.CharField(max_length=200)
    
    # Overall judgement
    overall_judgement = models.CharField(
        max_length=2,
        choices=[('OK', 'OK'), ('NG', 'NG')],
        default='OK'
    )
    
    # Approvals
    prepared_by = models.CharField(max_length=200, blank=True)
    approved_by = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.part_name} - {self.part_number}"


class ProcessParameter(models.Model):
    report = models.ForeignKey(InspectionReport, on_delete=models.CASCADE, related_name='process_parameters')
    sno = models.CharField(max_length=10)
    parameter_name = models.CharField(max_length=200)
    specification = models.CharField(max_length=200)
    method = models.CharField(max_length=200)
    
    # Process Setting Data 
    process_machine_no = models.CharField(max_length=100, blank=True)
    process_operator = models.CharField(max_length=100, blank=True)
    process_date_time = models.CharField(max_length=100, blank=True)
    
    # Data After M/C Change
    change_machine_no = models.CharField(max_length=100, blank=True)
    change_operator = models.CharField(max_length=100, blank=True)
    change_date_time = models.CharField(max_length=100, blank=True)
    
    # Data After M/C Change/LQA
    lqa_machine_no = models.CharField(max_length=100, blank=True)
    lqa_operator = models.CharField(max_length=100, blank=True)
    lqa_date_time = models.CharField(max_length=100, blank=True)
    
    action = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.parameter_name}"


class InProcessParameter(models.Model):
    report = models.ForeignKey(InspectionReport, on_delete=models.CASCADE, related_name='inprocess_parameters')
    sno = models.CharField(max_length=10)
    parameter_name = models.CharField(max_length=200)
    specification = models.CharField(max_length=200)
    method = models.CharField(max_length=200)
    readings = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return f"{self.parameter_name}"

 
 # 4M Procedure 


# Process Information 
class ProcessInformation(models.Model):
    process_name = models.CharField(max_length=255)
    purpose = models.TextField()
    scope = models.TextField()
    process_owner = models.CharField(max_length=255)

    def __str__(self):
        return self.process_name


# Format Record 
class FormatRecord(models.Model):
    sr_no = models.PositiveIntegerField()
    record_no = models.CharField(max_length=100)
    rev_no = models.CharField(max_length=10)
    rev_date = models.DateField()
    record_name = models.TextField()
    retention_period = models.CharField(max_length=100, blank=True)
    disposal_authority = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to='format_files/', blank=True, null=True)

    def __str__(self):
        return self.record_no


 # 4M Procedure 


# 4M Validation

class ChangeValidation(models.Model):
    product = models.CharField(max_length=255)
    process = models.CharField(max_length=255)
    line = models.CharField(max_length=255)
    customer = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField()
    shift = models.CharField(max_length=20)
    unexpected_change = models.CharField(
        max_length=20,
        choices=[("Man", "Man"), ("Machine", "Machine"), ("Material", "Material"), ("Method", "Method"), ("Others", "Others")]
    )
    change_point = models.TextField(blank=True, null=True)
    result_confirmation_status = models.CharField(max_length=100, blank=True)
    prepared_by = models.CharField(max_length=100, blank=True, null=True)
    approved_by = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.product} - {self.date}"


class ChangeValidationRow(models.Model):
    validation = models.ForeignKey(ChangeValidation, on_delete=models.CASCADE, related_name="rows")
    spec = models.TextField()  # Spec (Process & Product)
    remarks = models.TextField(blank=True, null=True)

    before_change_1 = models.CharField(max_length=100, blank=True, null=True)
    before_change_2 = models.CharField(max_length=100, blank=True, null=True)
    before_change_3 = models.CharField(max_length=100, blank=True, null=True)

    after_change_1 = models.CharField(max_length=100, blank=True, null=True)
    after_change_2 = models.CharField(max_length=100, blank=True, null=True)
    after_change_3 = models.CharField(max_length=100, blank=True, null=True)

    end_change_1 = models.CharField(max_length=100, blank=True, null=True)
    end_change_2 = models.CharField(max_length=100, blank=True, null=True)
    end_change_3 = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Row for {self.validation.id}"


# 4M Validation









from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

class OJTRecord(models.Model):
    """
    Main OJT Record linked to a FourMChange
    """
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('pass', 'Pass'),
        ('fail', 'Fail'),
    ]
    
    four_m_change = models.ForeignKey(
        'FourMChange', 
        on_delete=models.CASCADE, 
        related_name='ojt_records'
    )
    # trainee_name = models.CharField(max_length=200)
    # trainee_employee_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Auto-populated from FourMChange
    change_record_id = models.CharField(max_length=30)
    shopfloor_name = models.CharField(max_length=100)
    line_name = models.CharField(max_length=100)
    station_name = models.CharField(max_length=100, blank=True, null=True)
    department_name = models.CharField(max_length=100, blank=True, null=True)
    process_name = models.CharField(max_length=200, blank=True, null=True)
    
    # Status tracking
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='in_progress'
    )
    total_production_marks = models.IntegerField(default=0)
    total_quality_marks = models.IntegerField(default=0)
    overall_marks = models.IntegerField(default=0)
    
    # Metadata
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='ojt_records_created'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        
    
    def __str__(self):
        return f"OJT-{self.change_record_id}"


    def calculate_status(self):
        """
        Determine final OJT status only when all 6 days are completed.
        Requires BOTH production AND quality to meet minimum thresholds.
        """
        daily_scores = self.daily_scores.all()
        
        completed_days = daily_scores.filter(actual__isnull=False).count()
        
        if completed_days < 6:
            self.status = 'in_progress'
            self.completed_at = None
        else:
            # Minimum thresholds — adjust numbers if your company policy is different
            MIN_PRODUCTION = 12   # e.g. average ~2 marks/day or better
            MIN_QUALITY    = 12   # e.g. mostly low/zero rejections
            
            production_ok = self.total_production_marks >= MIN_PRODUCTION
            quality_ok    = self.total_quality_marks    >= MIN_QUALITY
            
            if production_ok and quality_ok:
                self.status = 'pass'
            else:
                self.status = 'fail'
            
            if not self.completed_at:
                self.completed_at = timezone.now()
        
        self.save(update_fields=['status', 'completed_at'])
        return self.status

    def update_totals(self):
        # Force fresh query — very important!
        self.refresh_from_db()                           # ← add this line

        daily_scores = self.daily_scores.all().select_related()  # even better

        prod = sum(s.production_marks for s in daily_scores)
        qual = sum(s.quality_marks for s in daily_scores)

        # Update & save
        self.total_production_marks = prod
        self.total_quality_marks = qual
        self.overall_marks = prod + qual

        self.save(update_fields=[
            'total_production_marks',
            'total_quality_marks',
            'overall_marks',
            'updated_at'
        ])

        # Make sure status sees the latest saved values
        self.refresh_from_db()

        return self.calculate_status()
    # def update_totals(self):
    #     daily_scores = self.daily_scores.all()  # fresh queryset

    #     prod = sum(s.production_marks for s in daily_scores)
    #     qual = sum(s.quality_marks for s in daily_scores)

    #     # Update fields
    #     self.total_production_marks = prod
    #     self.total_quality_marks = qual
    #     self.overall_marks = prod + qual

    #     self.save(update_fields=[
    #         'total_production_marks',
    #         'total_quality_marks',
    #         'overall_marks',
    #         'updated_at'  # optional
    #     ])

    #     # Refresh from db so calculate_status sees the just-saved values
    #     self.refresh_from_db()

    #     return self.calculate_status()
    

class OJTDailyScore(models.Model):
    """
    Daily performance tracking for each trainee
    """
    ojt_record = models.ForeignKey(
        OJTRecord, 
        on_delete=models.CASCADE, 
        related_name='daily_scores'
    )
    day = models.IntegerField()  # 1-6
    date = models.DateField(null=True, blank=True)
    
    # Production metrics
    plan = models.IntegerField(null=True, blank=True)
    actual = models.IntegerField(null=True, blank=True)
    production_marks = models.IntegerField(default=0)
    
    # Quality metrics
    rejections = models.IntegerField(null=True, blank=True)
    quality_marks = models.IntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['day']
        unique_together = ('ojt_record', 'day')
    
    # def __str__(self):
    #     return f"Day {self.day} - {self.ojt_record.trainee_name}"
    
    def calculate_marks(self):
        """
        Calculate marks based on performance
        Production: 4 marks if actual is filled
        Quality: 4 marks if rejections is filled
        """
        # Production marks
        if self.actual is not None:
            if self.plan and self.actual >= self.plan:
                self.production_marks = 4
            elif self.actual:
                # Partial marks based on percentage
                percentage = (self.actual / self.plan * 100) if self.plan else 0
                if percentage >= 90:
                    self.production_marks = 4
                elif percentage >= 75:
                    self.production_marks = 3
                elif percentage >= 60:
                    self.production_marks = 2
                else:
                    self.production_marks = 1
        else:
            self.production_marks = 0
        
        # Quality marks
        if self.rejections is not None:
            if self.rejections == 0:
                self.quality_marks = 4
            elif self.rejections <= 2:
                self.quality_marks = 3
            elif self.rejections <= 5:
                self.quality_marks = 2
            else:
                self.quality_marks = 1
        else:
            self.quality_marks = 0
        
        self.save()
        
        # Update parent record totals
        self.ojt_record.update_totals()





# ID PSN /Batch 

from datetime import date

class IdentificationPSN(models.Model):
    change = models.OneToOneField(FourMChange, on_delete=models.CASCADE, related_name='batch_info')
    
    # Auto-filled from Change Request
    part_name = models.CharField(max_length=200, blank=True)
    shopfloor_name = models.CharField(max_length=100, blank=True)
    line_name = models.CharField(max_length=100, blank=True)
    
    # Identification Details
    old_batch_no = models.CharField(max_length=100, blank=True, help_text="Last batch before change")
    new_batch_no = models.CharField(max_length=100, help_text="First batch with change")
    psn_start = models.CharField(max_length=100, blank=True, help_text="Starting Serial No.")
    
    # Method of Identification
    identification_method = models.CharField(max_length=200, help_text="e.g., Green Sticker, Stamp, Tag")
    # effective_date = models.DateField(default=timezone.now)
    effective_date = models.DateField(default=date.today)
    remarks = models.TextField(blank=True)
    
    updated_by = models.CharField(max_length=100) # User who filled this
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ID-{self.change.record_id} | {self.new_batch_no}"
    

# ID PSN /Batch end

 

 # models.py

class containment(models.Model):
    """
    Complete tracking sheet for a 4M Change Request.
    Links to FourMChange via record_id.
    """
    # Link to main change record
    change = models.OneToOneField(
        FourMChange, 
        on_delete=models.CASCADE, 
        related_name='tracking_sheet'
    )
    record_id = models.CharField(max_length=30, unique=True)  # Same as FourMChange.record_id
    
    # CHANGE DETAILS (Already in FourMChange, but frontend needs these)
    department = models.CharField(max_length=100, blank=True)  # Maps to shopfloor
    process = models.CharField(max_length=100, blank=True)     # Maps to station
    line = models.CharField(max_length=100, blank=True)        # Line info
    change_type = models.CharField(max_length=50, blank=True)  # Man/Machine/Material/Method
    reason = models.TextField(blank=True)
    
    # RISK ASSESSMENT
    potential_risk = models.TextField(blank=True)
    impact = models.TextField(blank=True)
    risk_level = models.CharField(
        max_length=1, 
        choices=[('L', 'Low'), ('M', 'Medium'), ('H', 'High')],
        default='L'
    )
    
    # CONTAINMENT PLAN
    containment_action = models.TextField(blank=True)
    area_affected = models.TextField(blank=True)
    duration = models.TextField(blank=True)
    responsibility = models.TextField(blank=True)
    inspection_method = models.TextField(blank=True)
    acceptance_criteria = models.TextField(blank=True)
    
    # TRIAL & VALIDATION
    trial_quantity = models.CharField(max_length=100, blank=True)
    defects_observed = models.CharField(max_length=100, blank=True)  # Yes/No + details
    observations = models.TextField(blank=True)
    
    # APPROVAL
    prepared_by = models.CharField(max_length=100, blank=True)
    reviewed_by = models.CharField(max_length=100, blank=True)
    approved_by = models.CharField(max_length=100, blank=True)
    
    # STATUS TRACKING
    is_complete = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # METADATA
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "4M Change Detail"
        verbose_name_plural = "4M Change Details"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.record_id} - {'Complete' if self.is_complete else 'Incomplete'}"
    
    def save(self, *args, **kwargs):
        # Auto-populate record_id from linked change
        if self.change and not self.record_id:
            self.record_id = self.change.record_id
        
        # Auto-mark complete if all critical fields filled
        if self.check_completeness():
            self.is_complete = True
            if not self.completed_at:
                self.completed_at = timezone.now()
        else:
            self.is_complete = False
            self.completed_at = None
            
        super().save(*args, **kwargs)
    
    def check_completeness(self):
        """
        Business logic: form is complete when:
        - Risk assessment done
        - Containment plan filled
        - Trial validation done
        - All approvals present
        """
        required_fields = [
            self.potential_risk,
            self.impact,
            self.containment_action,
            self.area_affected,
            self.responsibility,
            self.inspection_method,
            self.acceptance_criteria,
            self.trial_quantity,
            self.defects_observed,
            self.observations,
            self.prepared_by,
            self.reviewed_by,
            self.approved_by,
        ]
        return all(field.strip() for field in required_fields if isinstance(field, str))

#Process charecteristc checksheet.product charecteristc checksheet,perishable tool, paint shop quality   

# 2. Create the Universal Storage Model
# This stores the data from ALL sheets (Paint, Product, Process) in one place.
class SetupSheetEntry(models.Model):
    # Link to the 4M Change
    change = models.ForeignKey(FourMChange, on_delete=models.CASCADE, related_name='setup_sheet')
    
    # Stores the type (e.g., 'PAINT') so we know how to display it later
    sheet_type = models.CharField(max_length=20) 
    
    # ✅ THE MAGIC FIELD: Stores the entire React State (Rows, Checkboxes, etc.)
    data = models.JSONField(default=dict) 
    
    # Summary Result (for Dashboards)
    overall_result = models.CharField(max_length=10, choices=[('OK', 'OK'), ('NG', 'NG')], default='OK')
    
    # Traceability
    filled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('change', 'sheet_type') # One sheet per change

    def __str__(self):
        return f"{self.change.record_id} - {self.sheet_type}"
    
#Process charecteristc checksheet.product charecteristc checksheet,perishable tool, paint shop quality   


#customer aproval sheet start


class CustomerApprovalSheet(models.Model):
    # Link 1-to-1 with the Change Request
    change_request = models.OneToOneField(
        FourMChange, 
        on_delete=models.CASCADE, 
        related_name='customer_approval_sheet_data' # Distinct name
    )

    # --- Section 1: Header Info ---
    date = models.DateField(null=True, blank=True)
    reason_for_fpp = models.CharField(max_length=50, blank=True) # Stores "1", "2", etc.
    
    # --- Section 2: Part Details ---
    part_no = models.CharField(max_length=100, blank=True)
    part_name = models.CharField(max_length=150, blank=True)
    vendor_name = models.CharField(max_length=150, blank=True)
    model_name = models.CharField(max_length=100, blank=True)
    quantity = models.CharField(max_length=50, blank=True)
    
    modification_details = models.TextField(blank=True)
    
    # Signatures (Text names for now, or URLs if you upload images)
    prepared_by_sign = models.CharField(max_length=100, blank=True)
    approved_by_sign = models.CharField(max_length=100, blank=True)

    # --- Section 3: Dynamic Data (JSON) ---
    # We use JSONField because rows can vary
    
    # Stores: { "dept1": "QA", "item1": "Dim Check", "dept2": "Prod", "item2": "Fitment" }
    inspection_data = models.JSONField(default=dict, blank=True)

    # Stores List: [{ "chassis": "123", "comment": "OK", "sign": "John" }, ...]
    comments_data = models.JSONField(default=list, blank=True)

    # --- Section 4: Routing Info ---
    insp_date = models.DateField(null=True, blank=True)
    feeding_date = models.DateField(null=True, blank=True)
    feeding_time = models.TimeField(null=True, blank=True)
    
    person_incharge = models.CharField(max_length=100, blank=True)
    sec_mgr = models.CharField(max_length=100, blank=True)
    person_incharge_prod = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Sheet Data for {self.change_request.record_id}"
    
#customer aproval sheet end



class Personnel(models.Model):
    """
    Simple model for people in 4M responsibility matrix
    """
    name = models.CharField(max_length=100)
    photo = models.ImageField(
        upload_to='personnel_photos/',
        blank=True,
        null=True
    )
    phone_number = models.CharField(max_length=20, blank=True)
    
    # Simple designation choices
    DESIGNATION_CHOICES = [
        ('Engineer', 'Engineer'),
        ('Supervisor', 'Supervisor'),
        ('Manager', 'Manager'),
        ('Technician', 'Technician'),
    ]
    designation = models.CharField(
        max_length=30,
        choices=DESIGNATION_CHOICES,
        default='Supervisor'
    )
    
    # Shopfloor / Department
    shopfloor = models.ForeignKey(
        Shopfloor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='personnel'
    )
    
    # Responsibilities (simple text field – easy to edit)
    responsibilities = models.TextField(
        blank=True,
        help_text="Write main responsibilities (one per line is good)"
    )
    
    # Optional but very useful fields
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.shopfloor:
            return f"{self.name} – {self.designation} – {self.shopfloor}"
        return f"{self.name} – {self.designation}"
    
    class Meta:
        verbose_name_plural = "Personnel"
        ordering = ['shopfloor', 'name']
