"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { subtitle } from "@/config/class-variants";
import {
  CountryGroupDiscountInsertSchema,
  CountryGroupFormSchema,
  countryGroupFormSchema,
  CountryGroupQuerySchema,
} from "@/schema/country";
import { updateCountryGroupDiscountAction } from "@/server/action/country/update";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function CountryForm({
  productId,
  countryGroups,
}: {
  productId: string;
  countryGroups: CountryGroupQuerySchema[];
}) {
  const form = useForm<z.infer<typeof countryGroupFormSchema>>({
    resolver: zodResolver(countryGroupFormSchema),
    defaultValues: {
      groups: countryGroups.map((group) => {
        const discount =
          group.countryGroupDiscount?.[0]?.discount ??
          group.recommendedDiscount;

        return {
          id: group.id,
          coupon: group.countryGroupDiscount?.[0]?.coupon ?? "",
          discount: discount,
        };
      }),
    },
  });

  async function onSubmit(data: CountryGroupFormSchema) {
    const discountGroups: CountryGroupDiscountInsertSchema[] = data.groups.map(
      (group) => ({
        countryGroupId: group.id,
        productId,
        ...group,
      }),
    );

    const result = await updateCountryGroupDiscountAction(
      discountGroups,
      productId,
    );

    if (result?.error) {
      toast.error(result.message);
    }

    if (result.success) {
      toast.success(result.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country groups</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              {countryGroups.map((group, index) => (
                <CardContent key={group.id} className="pt-6">
                  <h2 className={subtitle({ class: "pb-4" })}>{group.name}</h2>
                  <div className="flex gap-4 flex-col sm:flex-row justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {group.country.map((country) => (
                        <Image
                          key={country.code}
                          width={24}
                          height={16}
                          alt={country.name}
                          title={country.name}
                          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`}
                        />
                      ))}
                    </div>
                    <Input
                      className="hidden"
                      {...form.register(`groups.${index}.id`)}
                    />
                    <div className="flex-shrink-0">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <FormField
                          control={form.control}
                          name={`groups.${index}.discount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount %</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  value={
                                    field.value === 0 ? "" : String(field.value)
                                  }
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? 0
                                        : e.target.valueAsNumber,
                                    )
                                  }
                                  min={0}
                                  max={100}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`groups.${index}.coupon`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coupon</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormMessage>
                        {form.formState.errors.groups?.[index]?.root?.message}
                      </FormMessage>
                    </div>
                  </div>
                </CardContent>
              ))}
              <CardFooter className="justify-end">
                <Button
                  className="w-full sm:w-min"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
