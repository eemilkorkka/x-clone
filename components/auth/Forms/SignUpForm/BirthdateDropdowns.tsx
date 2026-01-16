import { CustomSelect } from "@/components/customized/CustomSelect";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, UseFormReturn } from "react-hook-form";
import z from "zod";

export const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const monthStringSchema = z.enum(monthsArray);

interface BirthdateDropdownsProps {
    form: UseFormReturn<any>;
    month: string;
    day: number | unknown;
    year: number | unknown;
    styles?: string;
}

export const BirthdateDropdowns = ({ form, month, day, year, styles }: BirthdateDropdownsProps) => {
    return (
        <FieldGroup className="flex flex-row">
            <Controller
                name="month"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field className="w-3xl">
                        <CustomSelect
                            {...field}
                            label="Month"
                            value={month}
                            fieldState={fieldState}
                            options={monthsArray}
                            styles={styles}
                        />
                    </Field>
                )}
            />
            <Controller
                name="day"
                control={form.control}
                render={({ field, fieldState }) => {
                    const monthIndex = month ? monthsArray.indexOf(month) + 1 : null;

                    const daysInMonth = monthIndex && year
                        ? new Date(Number(year), monthIndex, 0).getDate()
                        : 31;

                    return (
                        <Field>
                            <CustomSelect
                                {...field}
                                label="Day"
                                value={day?.toString()}
                                fieldState={fieldState}
                                options={Array.from(
                                    { length: daysInMonth },
                                    (_, i) => (i + 1).toString()
                                )}
                                styles={styles}
                            />
                        </Field>
                    );
                }}
            />
            <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <CustomSelect
                            {...field}
                            label="Year"
                            value={year?.toString()}
                            fieldState={fieldState}
                            options={Array.from(
                                { length: new Date().getFullYear() - 1906 + 1 },
                                (_, i) => (new Date().getFullYear() - i).toString()
                            )}
                            styles={styles}
                        />
                    </Field>
                )}
            />
        </FieldGroup>
    )
}