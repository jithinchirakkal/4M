from django.shortcuts import render

from rest_framework import viewsets
from .models import FourMChange
from .serializers import FourMChangeSerializer

class FourMChangeViewSet(viewsets.ModelViewSet):
    queryset = FourMChange.objects.all()
    serializer_class = FourMChangeSerializer


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

