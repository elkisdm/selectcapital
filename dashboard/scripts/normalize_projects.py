#!/usr/bin/env python3
"""Normalize the CSV master file into JSON/JS consumable by the static panel."""

from __future__ import annotations

import csv
import json
import re
import unicodedata
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "projects_raw.csv"
JSON_PATH = ROOT / "data" / "projects.json"
JS_PATH = ROOT / "data" / "projects.js"


def clean_text(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    text = re.sub(r"\s+", " ", value.strip())
    if not text or text.upper() in {"N/A", "NA", "ND", "S/D", "SD", "NO APLICA"}:
        return None
    return text


def clean_multiline(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    parts = [segment.strip() for segment in value.replace("\r", "").split("\n")]
    text = " ".join(p for p in parts if p)
    return clean_text(text)


def capitalize_comuna(value: Optional[str]) -> Optional[str]:
    text = clean_text(value)
    if not text:
        return None
    return text.lower().title()


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")
    return slug or "item"


def parse_number(value: Optional[str]) -> Optional[float]:
    if value is None:
        return None
    text = value.strip()
    if not text:
        return None
    text = (
        text.replace("UF", "")
        .replace("uf", "")
        .replace("$", "")
        .replace(".", "")
        .replace(" ", "")
    )
    text = text.replace(",", ".")
    text = re.sub(r"[^0-9\.\-]", "", text)
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def parse_int(value: Optional[str]) -> Optional[int]:
    number = parse_number(value)
    if number is None:
        return None
    return int(round(number))


def parse_percent(value: Optional[str]) -> Optional[float]:
    number = parse_number(value)
    if number is None:
        return None
    return round(number, 2)


def format_percent_label(value: Optional[str]) -> Optional[str]:
    number = parse_percent(value)
    if number is None:
        return None
    if number.is_integer():
        return f"{int(number)}%"
    return f"{number}%"


def parse_bool(value: Optional[str]) -> Optional[bool]:
    if value is None:
        return None
    text = value.strip().lower()
    if not text:
        return None
    if text in {"si", "sí", "true", "1"}:
        return True
    if text in {"no", "false", "0"}:
        return False
    return None


def normalize_entrega(value: Optional[str]) -> Optional[str]:
    text = clean_text(value)
    if not text:
        return None
    if text.lower().startswith("inmedi"):
        return "Inmediata"
    match = re.match(r"([12])\s*S\s*(20\d{2})", text, re.IGNORECASE)
    if match:
        return f"{match.group(1).upper()}S{match.group(2)}"
    match = re.match(r"([12]S)\s*(20\d{2})", text, re.IGNORECASE)
    if match:
        return f"{match.group(1).upper()}{match.group(2)}"
    return text


def normalize_row(row: Dict[str, str], index: int) -> Optional[Dict[str, Any]]:
    project_name = clean_text(row.get("Proyecto"))
    if not project_name:
        return None

    pie_total = parse_int(row.get(" N° total Cuotas Pie"))
    if pie_total is None:
        before = parse_int(row.get("Cuotas antes de entrega")) or 0
        after = parse_int(row.get("Cuotas después de entrega")) or 0
        pie_total = before + after or None

    record: Dict[str, Any] = {
        "id": f"{slugify(project_name)}-{index+1}",
        "proyecto": project_name,
        "inmobiliaria": clean_text(row.get("Inmobiliaria")),
        "constructora": clean_text(row.get("Constructora")),
        "categoria": clean_text(row.get("Categoria")),
        "comuna": capitalize_comuna(row.get("Comuna")),
        "direccion": clean_text(row.get("Dirección")),
        "estado": clean_text(row.get("Estado")),
        "entrega": normalize_entrega(row.get("Entrega")),
        "aceptaRentaCorta": parse_bool(row.get("Acepta renta corta")),
        "arriendoGarantizado": clean_text(row.get("Arriendo Garantizado")),
        "comisionCI": format_percent_label(row.get("Comisión CI")) or clean_text(
            row.get("Comisión CI")
        ),
        "comisionBP": format_percent_label(row.get("Comisión BP")) or clean_text(
            row.get("Comisión BP")
        ),
        "formaDePago": clean_multiline(row.get("Forma de pago")),
        "condicionesEspeciales": clean_multiline(row.get("Promociones Broker")),
        "observaciones": clean_multiline(
            row.get("Observaciones, promociones y beneficios CLIENTES")
        ),
        "evento": clean_text(row.get("Evento") or row.get("Promociones Broker")),
        "datosReserva": clean_multiline(row.get("Datos reserva")),
        "estacionamiento": clean_text(row.get("Estacionamiento")),
        "bodega": clean_text(row.get("Bodega")),
        "precioIncluyeBonoPie": parse_bool(row.get("¿Precio contiene BP?")),
        "bpAplicaSecundarios": parse_bool(row.get("¿BP aplica a secundarios?")),
        "cuotasAntesEntrega": parse_int(row.get("Cuotas antes de entrega")),
        "pctPieAntesEntrega": parse_percent(row.get("% pie antes de entrega")),
        "cuotasDespuesEntrega": parse_int(row.get("Cuotas después de entrega")),
        "pctPieDespuesEntrega": parse_percent(row.get("% Pie después de entrega")),
        "cuotasAntesEntregaDesde": parse_number(
            row.get("Cuotas antes de entrega desde")
        ),
        "cuotasDespuesEntregaDesde": parse_number(
            row.get("Cuotas después de entrega desde")
        ),
        "cuotasCuoton": parse_int(row.get("Cuotas Cuotón")),
        "pctCuoton": parse_percent(row.get("% Cuotón")),
        "cuotasCuotonDesde": parse_number(row.get("Cuotas Cuotón desde")),
        "pieEnCuotas": pie_total,
        "bonoPiePct": parse_percent(row.get("% Bono pie (hasta)")),
        "pieEnCuotasPct": parse_percent(row.get("% Pie en cuotas")),
        "abonoInicial": parse_percent(row.get("Abono Inicial (hasta)")),
        "descuentoPct": parse_percent(row.get("% Descuento al precio de lista (hasta)")),
        "precioDesdeUF": parse_number(
            row.get("Precio desde (con descuento aplicado y bono pie incluido)")
        ),
        "valorReserva": parse_number(row.get("Valor reserva")),
    }

    return record


def load_rows() -> List[Dict[str, Any]]:
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV no encontrado: {CSV_PATH}")

    rows: List[Dict[str, Any]] = []
    with CSV_PATH.open("r", encoding="utf-8-sig") as handle:
        # discard first summary line
        _ = handle.readline()
        reader = csv.DictReader(handle)
        for idx, row in enumerate(reader):
            normalized = normalize_row(row, idx)
            if normalized:
                rows.append(normalized)
    return rows


def main() -> None:
    rows = load_rows()
    JSON_PATH.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    JS_PATH.write_text(
        "window.SELECT_PROJECTS = " + json.dumps(rows, ensure_ascii=False) + ";",
        encoding="utf-8",
    )
    print(f"{len(rows)} proyectos normalizados → {JSON_PATH.name} / {JS_PATH.name}")


if __name__ == "__main__":
    main()
