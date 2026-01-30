from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import FourMChangeDetail, RCR, FourMAction, FourMCategories, FourMChange,FourMCategory, Line, Role, Shopfloor, Station, User,Personnel,MachineCheckSheet
from .models import *

admin.site.register(FourMChange)
admin.site.register(FourMCategory)
admin.site.register(FourMAction)
admin.site.register(FourMCategories)
admin.site.register(Station)
admin.site.register(Line)
admin.site.register(Shopfloor)
admin.site.register(RCR)
admin.site.register(MachineCheckSheet)
admin.site.register(FourMChangeDetail)


from django.contrib import admin
from .models import MaterialMovementCard, MaterialMovementRow


class MaterialMovementRowInline(admin.TabularInline):
    model = MaterialMovementRow
    extra = 1
    autocomplete_fields = ['card']
    fields = [
        'proc_req', 'process_name', 'mc_no', 'date', 'shift',
        'change_info', 'opr_sign', 'qa_sign', 'net_wt'
    ]
    readonly_fields = []
    show_change_link = True


@admin.register(MaterialMovementCard)
class MaterialMovementCardAdmin(admin.ModelAdmin):
    list_display = ['item_description', 'part_no', 'wire_size', 'lot_no', 'mat_grade', 'created_at']
    search_fields = ['item_description', 'part_no', 'lot_no', 'mat_grade']
    list_filter = ['created_at', 'mat_grade']
    inlines = [MaterialMovementRowInline]


@admin.register(MaterialMovementRow)
class MaterialMovementRowAdmin(admin.ModelAdmin):
    list_display = ['card', 'process_name', 'date', 'shift', 'net_wt']
    search_fields = ['process_name', 'mc_no', 'card__item_description']
    list_filter = ['shift', 'date']
    autocomplete_fields = ['card']


from .models import ProcessInformation, FormatRecord

admin.site.register(ProcessInformation)
admin.site.register(FormatRecord)




from django.contrib import admin
from .models import containment


@admin.register(containment)
class ContainmentAdmin(admin.ModelAdmin):
    list_display = ('record_id', 'department', 'risk_level', 'is_complete')
    search_fields = ('record_id', 'department')
    list_filter = ('risk_level', 'is_complete')


from django.contrib import admin
from .models import OJTRecord, OJTDailyScore


@admin.register(OJTRecord)
class OJTRecordAdmin(admin.ModelAdmin):
    list_display = (
        'change_record_id',
        'shopfloor_name',
        'line_name',
        'status',
        'total_production_marks',
        'overall_marks',
        'created_at',
    )

    list_filter = ('status', 'shopfloor_name', 'line_name')
    search_fields = ('change_record_id',)


@admin.register(OJTDailyScore)
class OJTDailyScoreAdmin(admin.ModelAdmin):
    list_display = (
        'ojt_record',
        'day',
        'date',
        'actual',
        'production_marks',
        'quality_marks',
    )

    list_filter = ('day',)


admin.site.register(User)
admin.site.register(Role)
admin.site.register(Employee)

@admin.register(Personnel)
class PersonnelAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'designation',
        'phone_number',
        'shopfloor',
        'is_active',
    )
    list_filter = ('designation', 'shopfloor', 'is_active')
    search_fields = ('name', 'phone_number', 'shopfloor__name')
    ordering = ('shopfloor', 'name')