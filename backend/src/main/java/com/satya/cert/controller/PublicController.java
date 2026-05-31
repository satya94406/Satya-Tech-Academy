package com.satya.cert.controller;
import com.lowagie.text.*; import com.lowagie.text.pdf.PdfWriter; import com.satya.cert.entity.*; import com.satya.cert.repository.CertificateRequestRepository; import jakarta.servlet.http.HttpServletResponse; import org.springframework.web.bind.annotation.*; import java.awt.Color; import java.io.IOException;
@RestController @RequestMapping("/api/public")
public class PublicController{
  private final CertificateRequestRepository requests; public PublicController(CertificateRequestRepository r){this.requests=r;}
  @GetMapping("/certificates/{serialNo}") public CertificateRequest certificate(@PathVariable String serialNo){ CertificateRequest r=requests.findBySerialNo(serialNo).orElseThrow(); if(r.getStatus()!=RequestStatus.APPROVED) throw new RuntimeException("Certificate not approved"); return r; }
  @GetMapping("/verify/{serialNo}") public Object verify(@PathVariable String serialNo){ return requests.findBySerialNo(serialNo).filter(r->r.getStatus()==RequestStatus.APPROVED).<Object>map(r->r).orElse(java.util.Map.of("valid",false,"message","Certificate not found or not approved")); }
  @GetMapping("/certificates/{serialNo}/pdf") public void pdf(@PathVariable String serialNo, HttpServletResponse response) throws IOException{
    CertificateRequest r=requests.findBySerialNo(serialNo).orElseThrow(); if(r.getStatus()!=RequestStatus.APPROVED) throw new RuntimeException("Certificate not approved"); r.setDownloadCount((r.getDownloadCount()==null?0:r.getDownloadCount())+1); requests.save(r);
    response.setContentType("application/pdf"); response.setHeader("Content-Disposition","attachment; filename=certificate-"+serialNo+".pdf");
    Document doc=new Document(PageSize.A4.rotate(),36,36,36,36); PdfWriter.getInstance(doc,response.getOutputStream()); doc.open();
    Font title=new Font(Font.TIMES_ROMAN,34,Font.BOLD,new Color(120,80,0)); Font h=new Font(Font.TIMES_ROMAN,24,Font.BOLD); Font normal=new Font(Font.HELVETICA,14); Font small=new Font(Font.HELVETICA,10);
    Paragraph academy=new Paragraph("SATYA TECH ACADEMY", new Font(Font.TIMES_ROMAN,18,Font.BOLD,new Color(200,150,12))); academy.setAlignment(Element.ALIGN_CENTER); doc.add(academy);
    Paragraph p=new Paragraph("CERTIFICATE OF COMPLETION", title); p.setAlignment(Element.ALIGN_CENTER); p.setSpacingBefore(35); doc.add(p);
    Paragraph line=new Paragraph("This certificate is proudly presented to", normal); line.setAlignment(Element.ALIGN_CENTER); line.setSpacingBefore(28); doc.add(line);
    Paragraph name=new Paragraph(r.getStudentName(), h); name.setAlignment(Element.ALIGN_CENTER); name.setSpacingBefore(16); doc.add(name);
    Paragraph course=new Paragraph("For successfully completing the course: "+r.getCourseName(), normal); course.setAlignment(Element.ALIGN_CENTER); course.setSpacingBefore(20); doc.add(course);
    if(r.getDuration()!=null) { Paragraph d=new Paragraph("Duration: "+r.getDuration(), normal); d.setAlignment(Element.ALIGN_CENTER); d.setSpacingBefore(10); doc.add(d); }
    Paragraph date=new Paragraph("Issue Date: "+r.getIssueDate()+"        Certificate No: "+r.getSerialNo(), small); date.setAlignment(Element.ALIGN_CENTER); date.setSpacingBefore(55); doc.add(date);
    Paragraph sign=new Paragraph("\n"+r.getInstructorName()+"\nDirector, Satya Tech Academy", small); sign.setAlignment(Element.ALIGN_RIGHT); doc.add(sign); doc.close();
  }
}
