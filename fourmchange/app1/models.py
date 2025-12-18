from django.db import models
from django.utils import timezone

class Shopfloor(models.Model):
    name = models.CharField(max_length=100, unique=True)

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
    shopfloor = models.ForeignKey(Shopfloor, on_delete=models.CASCADE, null=True, blank=True)
    line = models.ForeignKey(Line, on_delete=models.CASCADE, null=True, blank=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=True, blank=True)
    four_m = models.CharField(max_length=20, choices=FOUR_M_CHOICES)
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

class FourMChangeDetail(models.Model):
    date = models.DateField()
    time = models.TimeField()
    mc_no = models.CharField(max_length=50, blank=True, null=True)
    change_description = models.TextField(blank=True, null=True)
    nature_of_change = models.TextField(blank=True, null=True)
    action_taken = models.TextField(blank=True, null=True)
    part_name_no = models.CharField(max_length=100, blank=True, null=True)
    control_no = models.CharField(max_length=100, blank=True, null=True)
    lot_no_batch_no = models.CharField(max_length=100, blank=True, null=True)
    tracking_no_serial = models.CharField(max_length=100, blank=True, null=True)
    retro_qty = models.CharField(max_length=50, blank=True, null=True)
    retro_wh_no = models.CharField(max_length=50, blank=True, null=True)
    retro_assy = models.CharField(max_length=50, blank=True, null=True)
    retro_moog = models.CharField(max_length=50, blank=True, null=True)
    retro_cust = models.CharField(max_length=50, blank=True, null=True)
    retro_ott_pn = models.CharField(max_length=50, blank=True, null=True)
    containment_assy = models.CharField(max_length=50, blank=True, null=True)
    containment_ship = models.CharField(max_length=50, blank=True, null=True)
    containment_lot_invoice = models.CharField(max_length=100, blank=True, null=True)
    sl_op = models.CharField(max_length=50, blank=True, null=True)
    sl_production = models.CharField(max_length=50, blank=True, null=True)
    sl_plant_impl = models.CharField(max_length=50, blank=True, null=True)
    material_details_1 = models.CharField(max_length=100, blank=True, null=True)
    material_details_2 = models.CharField(max_length=100, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Change Detail {self.date} {self.time}"    

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

 