from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import FourMAction, FourMCategories, FourMChange,FourMCategory, Line, Shopfloor, Station


admin.site.register(FourMChange)
admin.site.register(FourMCategory)
admin.site.register(FourMAction)
admin.site.register(FourMCategories)
admin.site.register(Station)
admin.site.register(Line)
admin.site.register(Shopfloor)



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
