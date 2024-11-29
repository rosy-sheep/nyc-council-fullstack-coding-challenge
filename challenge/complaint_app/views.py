from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserSerializer, UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
# Create your views here.

class ComplaintViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  serializer_class = ComplaintSerializer
  def list(self, request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.district
    
    user_district_padded = f"NYCC{user_district.zfill(2)}"

    complaints = Complaint.objects.filter(account=user_district_padded)
    
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)

class OpenCasesViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  def list(self, request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.district
    
    user_district_padded = f"NYCC{user_district.zfill(2)}"
    
    # Find open complaints by filtering by no closedate
    open_complaints = Complaint.objects.filter(account=user_district_padded, closedate__isnull=True)
    
    serializer = ComplaintSerializer(open_complaints, many=True)
    return Response(serializer.data)

class ClosedCasesViewSet(viewsets.ModelViewSet):
  http_method_names = ['get'] 
  def list(self, request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.district
    
    user_district_padded = f"NYCC{user_district.zfill(2)}"
    
    # Find closed complaints by filtering by valid closedate
    closed_complaints = Complaint.objects.filter(account=user_district_padded, closedate__isnull=False)
    
    serializer = ComplaintSerializer(closed_complaints, many=True)
    return Response(serializer.data)
    
class TopComplaintTypeViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  def list(self, request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.district
    
    user_district_padded = f"NYCC{user_district.zfill(2)}"

    top_complaint_types = Complaint.objects.filter(account=user_district_padded) \
        .values('complaint_type') \
        .annotate(type_count=Count('complaint_type')) \
        .order_by('-type_count')[:3]
    
    top_types_data = [{'complaint_type': item['complaint_type'], 'count': item['type_count']} for item in top_complaint_types]
    
    return Response(top_types_data)

class ConstituentsComplaintsViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  serializer_class = ComplaintSerializer
  def list(self, request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_district = user_profile.district
    
    user_district_padded = f"NYCC{user_district.zfill(2)}"

    complaints = Complaint.objects.filter(council_dist=user_district_padded)
    
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)