"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { subtitle } from "@/config/class-variants";
import {
  countryGroupFormSchema,
  CountryGroupQuerySchema,
} from "@/schema/country";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
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
          group.countryGroupDiscount[0]?.discount ?? group.recommendedDiscount;

        return {
          id: group.id,
          coupon: group.countryGroupDiscount[0]?.coupon,
          discount: discount * 100, // we store discount from 0 to 1 in our database
        };
      }),
    },
  });

  function onSubmit() {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          {countryGroups.map((group) => (
            <CardContent key={group.id} className="pt-6">
              <h2 className={subtitle()}>{group.name}</h2>
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
            </CardContent>
          ))}
        </Card>
      </form>
    </Form>
  );
}
