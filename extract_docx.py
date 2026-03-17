from docx import Document

doc = Document(r'c:\Users\fivia\Desktop\Hydratech\HYDRANET_UPDATED_CONSENT.docx')
for para in doc.paragraphs:
    print(para.text)
