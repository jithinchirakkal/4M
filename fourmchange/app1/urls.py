"""
URL configuration for fourmchange project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  CustomerApprovalSheetViewSet, CustomerApprovalViewSet, FourMApprovalViewSet, IdentificationPSNViewSet, LogoutView, MaterialMovementCardViewSet, SetupSheetViewSet, SuspectedLotViewSet
from .views import (
    ShopfloorViewSet, LineViewSet, StationViewSet,containmentViewSet,PersonnelViewSet,
    FourMCategoriesViewSet, FourMActionViewSet, FourMChangeViewSet,FourMApprovalViewSet
)

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserViewSet,
    RoleViewSet,
    MyTokenObtainPairView,
)

from .views import FourMCategoryViewSet, FourMTrackingViewSet, FourMChangeDetailViewSet
from .views import ManMachineMatrixViewSet,ControlPlanViewSet,RCRViewSet
from .views import InspectionReportViewSet, ProcessParameterViewSet, InProcessParameterViewSet
from .views import ProcessFlowViewSet, ProcessViewSet, RevisionViewSet
from .views import ProcessInformationViewSet, FormatRecordViewSet
from .views import ChangeValidationViewSet,OJTRecordViewSet,OJTDailyScoreViewSet
from .views import *




router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'roles', RoleViewSet, basename='roles')
router.register(r'shopfloors', ShopfloorViewSet)
router.register(r'lines', LineViewSet)
router.register(r'stations', StationViewSet)
router.register(r'4m-categories', FourMCategoriesViewSet)
router.register(r'actions', FourMActionViewSet)
router.register(r'4m-changes', FourMChangeViewSet)

router.register(r'4m-approvals', FourMApprovalViewSet, basename='fourm-approvals')
router.register(r'customer-approvals', CustomerApprovalViewSet, basename='customer-approvals')  # NEW

router.register(r'material-movement-cards', MaterialMovementCardViewSet)

router.register(r'categories', FourMCategoryViewSet, basename='category')
router.register(r'trackings', FourMTrackingViewSet, basename='tracking')
router.register(r'change-details', FourMChangeDetailViewSet, basename='change-detail')
router.register(r'matrix', ManMachineMatrixViewSet, basename='matrix')
router.register(r'controlplans', ControlPlanViewSet)
router.register(r"rcr", RCRViewSet, basename="rcr")
router.register(r"suspected-lot", SuspectedLotViewSet, basename="suspected-lot")
router.register(r'reports', InspectionReportViewSet)
router.register(r'process-parameters', ProcessParameterViewSet)
router.register(r'inprocess-parameters', InProcessParameterViewSet)
router.register(r'process-flows', ProcessFlowViewSet, basename='processflow')
router.register(r'processes', ProcessViewSet, basename='process')
router.register(r'revisions', RevisionViewSet, basename='revision')


router.register(r'process-info', ProcessInformationViewSet)
router.register(r'format-records', FormatRecordViewSet)

router.register(r'validation', ChangeValidationViewSet)
router.register(r'ojt-records', OJTRecordViewSet, basename='ojt-record')
router.register(r'ojt-daily-scores', OJTDailyScoreViewSet, basename='ojt-daily-score')
router.register(r'fourm-change-details', containmentViewSet, basename='fourm-change-detail')


router.register(r'identification', IdentificationPSNViewSet, basename='identification')

router.register(r'setup-sheet', SetupSheetViewSet)
router.register(r'customer-approval-sheets', CustomerApprovalSheetViewSet, basename='customer-approval-sheets')
router.register(r'personnel', PersonnelViewSet, basename='personnel')
router.register(r'machine-check-sheets',MachineCheckSheetViewSet,basename='machine-check-sheet')
router.register(r'change-validations', ValidationReportViewSet, basename='change-validation')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('employees/', EmployeeListCreateAPIView.as_view(), name='employee-list-create'),
    path('employees/upload/', EmployeeBulkUploadView.as_view(), name='employee-bulk-upload'),
    path('employees/template/', DownloadEmployeeTemplateView.as_view(), name='employee-template-download'),
]



