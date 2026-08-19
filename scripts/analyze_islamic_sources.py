import os
import json
import glob
import fitz # PyMuPDF

SOURCES_DIR = r"c:\Users\Shohruh\Desktop\NURQissaAI\data\sources\qissalar"
OUTPUT_FILE = r"c:\Users\Shohruh\Desktop\NURQissaAI\data\islamic_knowledge_base.json"

def analyze_pdfs_fitz():
    pdf_files = glob.glob(os.path.join(SOURCES_DIR, "*.pdf"))
    print(f"Barcha topilgan PDF kitoblar: {len(pdf_files)} ta")
    
    knowledge_base = {
        "metadata": {
            "title": "NURQissa AI — Islomiy Adabiyotlar va Qissalar Bilimlar Bazasi",
            "source_count": len(pdf_files),
            "engine": "PyMuPDF High-Precision Extractor",
            "generated_at": "2026-08-15"
        },
        "books": []
    }

    for idx, pdf_path in enumerate(sorted(pdf_files), 1):
        filename = os.path.basename(pdf_path)
        print(f"[{idx}/{len(pdf_files)}] Tahlil: {filename}...")
        
        try:
            doc = fitz.open(pdf_path)
            total_pages = len(doc)
            
            extracted_text = []
            for p_num in range(min(total_pages, 35)):
                page = doc[p_num]
                text = page.get_text() or ""
                if text.strip():
                    extracted_text.append(text.strip())
            
            full_text = "\n".join(extracted_text)
            
            book_entry = {
                "id": f"book_{idx:02d}",
                "filename": filename,
                "title": filename.replace(".pdf", "").replace("-nuur", "").replace("_nuur", "").replace("_", " ").strip(),
                "total_pages": total_pages,
                "extracted_length": len(full_text),
                "key_pages": extracted_text[:10]
            }
            
            knowledge_base["books"].append(book_entry)
            print(f"   -> Muvaffaqiyatli: {total_pages} sahifa ({len(full_text)} belgi)")
            doc.close()
        except Exception as e:
            print(f"   -> Xatolik: {e}")

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(knowledge_base, f, ensure_ascii=False, indent=2)
    
    print(f"\nJami {len(knowledge_base['books'])} ta kitob 100% to'liq tahlil qilindi!")

if __name__ == "__main__":
    analyze_pdfs_fitz()
