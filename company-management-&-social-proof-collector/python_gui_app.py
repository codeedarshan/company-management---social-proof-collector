"""
Testimonial & Social Proof Collector - Desktop Python GUI (Tkinter + SQLite)
Conforming to MERN Evaluation Project Brief 05
Run locally on your computer with Python 3:
    python python_gui_app.py
"""

import tkinter as tk
from tkinter import ttk, messagebox
import json
from datetime import datetime
from python_testimonial_system import TestimonialCollectorDB

class TestimonialAppGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Acme Proof - Testimonial & Social Proof Collector (Python 3)")
        self.root.geometry("1020x720")
        self.root.configure(bg="#f8fafc")

        self.db = TestimonialCollectorDB()
        self.setup_styles()
        self.create_header()
        self.create_tabs()
        self.load_data()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TNotebook", background="#f8fafc")
        style.configure("TNotebook.Tab", padding=[16, 8], font=("Segoe UI", 10, "bold"))
        style.map("TNotebook.Tab", background=[("selected", "#4f46e5")], foreground=[("selected", "#ffffff")])
        style.configure("Treeview", font=("Segoe UI", 9), rowheight=28)
        style.configure("Treeview.Heading", font=("Segoe UI", 10, "bold"), background="#e2e8f0")

    def create_header(self):
        header = tk.Frame(self.root, bg="#0f172a", height=75, padx=20)
        header.pack(fill="x", side="top")

        title_lbl = tk.Label(
            header,
            text="✨ Acme Proof - Testimonial & Social Proof Collector",
            font=("Segoe UI", 16, "bold"),
            bg="#0f172a",
            fg="#ffffff"
        )
        title_lbl.pack(side="left", pady=18)

        status_badge = tk.Label(
            header,
            text="● SQLite3 Engine Active",
            font=("Segoe UI", 9, "bold"),
            bg="#065f46",
            fg="#a7f3d0",
            padx=12,
            pady=4
        )
        status_badge.pack(side="right", pady=20)

    def create_tabs(self):
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True, padx=16, pady=16)

        # Tab 1: Moderation Inbox (Spec C)
        self.tab_inbox = tk.Frame(self.notebook, bg="#f8fafc")
        self.notebook.add(self.tab_inbox, text="📥 Moderation Inbox")
        self.build_inbox_tab()

        # Tab 2: Wall of Love & Embeds (Spec D)
        self.tab_wall = tk.Frame(self.notebook, bg="#f8fafc")
        self.notebook.add(self.tab_wall, text="❤️ Wall of Love & Embed")
        self.build_wall_tab()

        # Tab 3: Spaces & Slugs (Spec A)
        self.tab_spaces = tk.Frame(self.notebook, bg="#f8fafc")
        self.notebook.add(self.tab_spaces, text="🚀 Space Settings")
        self.build_spaces_tab()

        # Tab 4: Metrics (Spec E)
        self.tab_metrics = tk.Frame(self.notebook, bg="#f8fafc")
        self.notebook.add(self.tab_metrics, text="📊 Rating Analytics")
        self.build_metrics_tab()

    def build_inbox_tab(self):
        top_bar = tk.Frame(self.tab_inbox, bg="#f8fafc")
        top_bar.pack(fill="x", padx=10, pady=10)

        tk.Label(top_bar, text="Status Filter:", font=("Segoe UI", 9, "bold"), bg="#f8fafc").pack(side="left", padx=4)
        self.filter_var = tk.StringVar(value="all")
        for st in ["all", "pending", "approved", "archived"]:
            ttk.Radiobutton(top_bar, text=st.capitalize(), value=st, variable=self.filter_var, command=self.load_data).pack(side="left", padx=4)

        btn_appr = tk.Button(top_bar, text="✓ Approve", bg="#10b981", fg="white", font=("Segoe UI", 9, "bold"), padx=10, command=lambda: self.update_status("approved"))
        btn_appr.pack(side="right", padx=4)

        btn_feat = tk.Button(top_bar, text="★ Toggle Featured", bg="#f59e0b", fg="white", font=("Segoe UI", 9, "bold"), padx=10, command=self.toggle_featured)
        btn_feat.pack(side="right", padx=4)

        btn_arch = tk.Button(top_bar, text="Archive", bg="#64748b", fg="white", font=("Segoe UI", 9), padx=10, command=lambda: self.update_status("archived"))
        btn_arch.pack(side="right", padx=4)

        cols = ("id", "client", "role", "rating", "status", "featured", "review")
        self.tree = ttk.Treeview(self.tab_inbox, columns=cols, show="headings", height=16)
        self.tree.heading("id", text="ID")
        self.tree.heading("client", text="Client Name")
        self.tree.heading("role", text="Role / Company")
        self.tree.heading("rating", text="Rating")
        self.tree.heading("status", text="Status")
        self.tree.heading("featured", text="Featured")
        self.tree.heading("review", text="Review Text")

        self.tree.column("id", width=60)
        self.tree.column("client", width=140)
        self.tree.column("role", width=160)
        self.tree.column("rating", width=70)
        self.tree.column("status", width=80)
        self.tree.column("featured", width=70)
        self.tree.column("review", width=380)

        self.tree.pack(fill="both", expand=True, padx=10, pady=6)

    def build_wall_tab(self):
        frame = tk.Frame(self.tab_wall, bg="#f8fafc", padx=16, pady=16)
        frame.pack(fill="both", expand=True)

        tk.Label(frame, text="Generate Embed Snippet for Webflow, Shopify or React:", font=("Segoe UI", 11, "bold"), bg="#f8fafc").pack(anchor="w", pady=(0, 6))

        opts_frame = tk.Frame(frame, bg="#f8fafc")
        opts_frame.pack(fill="x", pady=6)

        tk.Label(opts_frame, text="Layout:", font=("Segoe UI", 9, "bold"), bg="#f8fafc").pack(side="left")
        self.layout_var = tk.StringVar(value="grid")
        for lay in ["grid", "carousel", "badge"]:
            ttk.Radiobutton(opts_frame, text=lay.capitalize(), value=lay, variable=self.layout_var, command=self.update_snippet).pack(side="left", padx=6)

        tk.Label(opts_frame, text="Theme:", font=("Segoe UI", 9, "bold"), bg="#f8fafc").pack(side="left", padx=(16, 4))
        self.theme_var = tk.StringVar(value="light")
        for thm in ["light", "dark"]:
            ttk.Radiobutton(opts_frame, text=thm.capitalize(), value=thm, variable=self.theme_var, command=self.update_snippet).pack(side="left", padx=6)

        self.snippet_text = tk.Text(frame, height=10, font=("Consolas", 10), bg="#1e293b", fg="#e2e8f0", padx=12, pady=12)
        self.snippet_text.pack(fill="x", pady=10)

        btn_copy = tk.Button(frame, text="📋 Copy Snippet to Clipboard", bg="#4f46e5", fg="white", font=("Segoe UI", 10, "bold"), padx=14, pady=6, command=self.copy_snippet)
        btn_copy.pack(anchor="w")

    def build_spaces_tab(self):
        frame = tk.Frame(self.tab_spaces, bg="#f8fafc", padx=16, pady=16)
        frame.pack(fill="both", expand=True)

        tk.Label(frame, text="Existing Spaces & Public URLs:", font=("Segoe UI", 11, "bold"), bg="#f8fafc").pack(anchor="w")
        self.spaces_box = tk.Text(frame, height=14, font=("Consolas", 9), bg="#ffffff", fg="#1e293b", padx=10, pady=10)
        self.spaces_box.pack(fill="both", expand=True, pady=8)

    def build_metrics_tab(self):
        frame = tk.Frame(self.tab_metrics, bg="#f8fafc", padx=20, pady=20)
        frame.pack(fill="both", expand=True)

        self.metrics_label = tk.Label(frame, text="Calculating metrics...", font=("Segoe UI", 12), bg="#f8fafc", justify="left")
        self.metrics_label.pack(anchor="w", pady=10)

    def load_data(self):
        # 1. Testimonials
        for row in self.tree.get_children():
            self.tree.delete(row)

        reviews = self.db.list_testimonials_inbox(status=self.filter_var.get())
        for r in reviews:
            stars = "★" * r["rating"]
            feat = "Yes ⭐" if r["isFeatured"] else "No"
            self.tree.insert("", "end", values=(r["id"], r["clientName"], f"{r['companyRole']} ({r['companyName']})", stars, r["status"].upper(), feat, r["reviewText"]))

        # 2. Spaces
        spaces = self.db.list_spaces()
        self.spaces_box.delete("1.0", "end")
        for s in spaces:
            self.spaces_box.insert("end", f"Space Name: {s['name']}\nSlug:       /collect/{s['slug']}\nPublic Wall: /wall/{s['slug']}\nHeadline:   {s['headline']}\n---------------------------------------------------------------\n")

        # 3. Metrics
        m = self.db.get_rating_metrics("acme-corp")
        txt = f"""
Summary Rating Stats for Acme Corp:
=====================================================
★ Average Star Rating:    {m['averageRating']} / 5.0
📝 Total Submissions:       {m['totalReviews']} reviews
✅ Approved & Live:        {m['approvedCount']}
⏳ Pending Moderation:     {m['pendingCount']}
📈 Wall Approval Ratio:    {m['approvalRate']}%

Star Rating Distribution:
  5 Stars: {'█' * (m['distribution'][5] * 4)} ({m['distribution'][5]})
  4 Stars: {'█' * (m['distribution'][4] * 4)} ({m['distribution'][4]})
  3 Stars: {'█' * (m['distribution'][3] * 4)} ({m['distribution'][3]})
  2 Stars: {'█' * (m['distribution'][2] * 4)} ({m['distribution'][2]})
  1 Star:  {'█' * (m['distribution'][1] * 4)} ({m['distribution'][1]})
=====================================================
        """
        self.metrics_label.config(text=txt)
        self.update_snippet()

    def update_snippet(self):
        snip = self.db.generate_embed_snippet("acme-corp", layout=self.layout_var.get(), theme=self.theme_var.get())
        self.snippet_text.delete("1.0", "end")
        self.snippet_text.insert("end", snip["snippet"])

    def copy_snippet(self):
        text = self.snippet_text.get("1.0", "end-1c")
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        messagebox.showinfo("Copied", "Embed code copied to clipboard!")

    def update_status(self, new_status):
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("Select Item", "Please select a review from the table.")
            return
        item_id = self.tree.item(selected[0])["values"][0]
        self.db.update_status(item_id, new_status)
        self.load_data()

    def toggle_featured(self):
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("Select Item", "Please select a review from the table.")
            return
        item_id = self.tree.item(selected[0])["values"][0]
        self.db.toggle_featured(item_id)
        self.load_data()

if __name__ == "__main__":
    root = tk.Tk()
    app = TestimonialAppGUI(root)
    root.mainloop()
