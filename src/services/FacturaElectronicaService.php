<?php

namespace App\Services;

use App\Models\Factura;
use Illuminate\Support\Facades\Storage;

class FacturaElectronicaService
{
    public function enviarFactura(Factura $factura): array
    {
        // 1. Generar un CUFE de mentira (hash de los datos)
        $cufe = hash(
            'sha256',
            $factura->id_factura .
            $factura->fecha_emision .
            $factura->total .
            ($factura->cliente->Documento_Cliente ?? '')
        );

        // 2. Generar un XML simple (NO es UBL real, solo demo)
        $xml = new \SimpleXMLElement('<FacturaElectronicaDemo/>');
        $xml->addChild('Numero', (string) $factura->id_factura);
        $xml->addChild('Fecha', (string) $factura->fecha_emision);
        $xml->addChild('Total', (string) $factura->total);
        $xml->addChild('ClienteNombre', $factura->cliente->Nombre1_Cliente ?? 'SIN NOMBRE');
        $xml->addChild('ClienteDocumento', $factura->cliente->Documento_Cliente ?? 'SIN DOC');
        $xml->addChild('CUFE', $cufe);
        $xml->addChild('EstadoSimulado', 'ACEPTADA');

        $path = 'facturas_xml/factura_' . $factura->id_factura . '.xml';
        Storage::put($path, $xml->asXML());

        // 3. Simular respuesta de DIAN
        return [
            'estado' => 'ACEPTADA',
            'cufe'   => $cufe,
            'xml'    => $path,
        ];
    }
}
