package com.api.pizza.service;

import java.util.List;
import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;

import com.api.pizza.entity.Customer;

public class CustomerExcelExporter {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<Customer> customers;

    /**
     * Constructor khởi tạo server export danh sách Customer
     * 
     * @param customers
     */
    public CustomerExcelExporter(List<Customer> customers) {
        this.customers = customers;
        this.workbook = new XSSFWorkbook();
    }

    /**
     * Tạo các ô cho excel file.
     * 
     * @param row
     * @param columnCount
     * @param value
     * @param style
     */
    private void createCells(Row row, int columnCount, Object value, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    /**
     * Khai báo cho sheet và các dòng Header
     */
    private void writeHeaderLine() {
        this.sheet = workbook.createSheet("Customers");

        Row row = this.sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);

        createCells(row, 0, "User ID", style);
        createCells(row, 1, "Phone", style);
        createCells(row, 2, "Full Name", style);
        createCells(row, 3, "Address", style);
        createCells(row, 4, "Sale", style);
        createCells(row, 5, "Action", style);
    }

    /**
     * fill dữ liệu cho các dòng tiếp theo.
     */
    private void writeDataLines() {
        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14);
        style.setFont(font);

        for (Customer user : this.customers) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;

            createCells(row, columnCount++, user.getId(), style);
            createCells(row, columnCount++, user.getPhoneNumber(), style);
            createCells(row, columnCount++, user.getFirstName() + ", " + user.getLastName(), style);
            createCells(row, columnCount++, user.getAddress(), style);
            createCells(row, columnCount++, user.getSalesRepEmployeeNumber(), style);
            createCells(row, columnCount++, "ABC", style);

        }
    }

    /**
     * xuất dữ liệu ra dạng file
     * 
     * @param response
     * @throws IOException
     */
    public void export(HttpServletResponse response) throws IOException {
        writeHeaderLine();
        writeDataLines();

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();

        outputStream.close();

    }
}
