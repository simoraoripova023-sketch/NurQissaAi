import os
import fitz

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SOURCES_DIR = os.path.join(BASE_DIR, "data", "sources", "qissalar")
PUBLIC_STORIES_DIR = os.path.join(BASE_DIR, "public", "stories")
os.makedirs(PUBLIC_STORIES_DIR, exist_ok=True)

def extract_asmo_and_yusuf():
    # Asmo & Yusuf specific pages
    targets = [
        ("Hikoyalar orqali Qur'on o'qishni o'rganaman_nuur.pdf", "asmo", [0, 3, 4, 5, 6]),
        ("Aqilli bola Yusuf.pdf", "yusuf", [0, 1, 3, 5, 7]),
        ("Allohning chin do’sti - nuur-uz.pdf", "ibrohim", [0, 3, 4, 6]),
    ]
    
    for pdf_name, prefix, pages in targets:
        pdf_path = os.path.join(SOURCES_DIR, pdf_name)
        if os.path.exists(pdf_path):
            doc = fitz.open(pdf_path)
            for page_idx in pages:
                if page_idx < len(doc):
                    page = doc[page_idx]
                    pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))
                    out_name = f"{prefix}_scene_{page_idx}.png"
                    out_path = os.path.join(PUBLIC_STORIES_DIR, out_name)
                    pix.save(out_path)
                    print(f"Extracted: {out_name}")
            doc.close()

if __name__ == "__main__":
    extract_asmo_and_yusuf()
